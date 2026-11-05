<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const successMessage = ref("");

const bookings = ref([]);
const destinations = ref([]);

const loading = ref(true);
const loadError = ref("");
const destinationsError = ref("");

let messageTimer;

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

onMounted(() => {
  successMessage.value = sessionStorage.getItem("admin_message") || "";

  if (successMessage.value) {
    sessionStorage.removeItem("admin_message");

    messageTimer = setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  }

  loadBookings();
  loadDestinations();
});

onUnmounted(() => {
  clearTimeout(messageTimer);
});

// Load bookings from Laravel
async function loadBookings() {
  loading.value = true;
  loadError.value = "";

  try {
    const token = sessionStorage.getItem("admin_token");

    const response = await fetch(`${API_BASE}/admin/bookings`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to load bookings (${response.status}).`);
    }

    const result = await response.json();

    const rows = Array.isArray(result)
      ? result
      : result.data ?? result.bookings ?? [];

    if (!Array.isArray(rows)) {
      throw new Error("The bookings response has an unexpected format.");
    }

    bookings.value = rows;
  } catch (error) {
    loadError.value =
      error.message || "Could not load dashboard data.";
  } finally {
    loading.value = false;
  }
}

// Load destinations from Laravel
async function loadDestinations() {
  destinationsError.value = "";

  try {
    const token = sessionStorage.getItem("admin_token");

    const response = await fetch(`${API_BASE}/admin/destinations`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Unable to load destinations (${response.status}).`
      );
    }

    const result = await response.json();

    const rows = Array.isArray(result)
      ? result
      : result.data ?? result.destinations ?? [];

    if (!Array.isArray(rows)) {
      throw new Error("The destinations response has an unexpected format.");
    }

    destinations.value = rows;
  } catch (error) {
    destinationsError.value =
      error.message || "Could not load destinations.";
  }
}

// General helpers
function firstValue(...values) {
  return values.find(
    (value) => value !== null && value !== undefined && value !== ""
  );
}

function customerName(booking) {
  return (
    firstValue(
      booking.customer?.name,
      booking.user?.name,
      booking.customer_name,
      booking.name
    ) || "Guest"
  );
}

function customerEmail(booking) {
  return (
    firstValue(
      booking.customer?.email,
      booking.user?.email,
      booking.customer_email,
      booking.email
    ) || "No email provided"
  );
}

function tourName(booking) {
  return (
    firstValue(
      booking.tour?.name,
      booking.tourPackage?.name,
      booking.tour_package?.name,
      booking.tour_package?.title,
      booking.package?.name,
      booking.tour_name,
      booking.destination_name
    ) || "Tour not specified"
  );
}

function bookingDate(booking) {
  return firstValue(
    booking.booking_date,
    booking.travel_date,
    booking.created_at,
    booking.date
  );
}

function travelerCount(booking) {
  const value = firstValue(
    booking.number_of_travelers,
    booking.travelers_count,
    booking.traveler_count,
    booking.total_travelers,
    booking.guests
  );

  if (typeof value === "number" || typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (Array.isArray(booking.travelers)) {
    return booking.travelers.length;
  }

  return 0;
}

function bookingStatus(booking) {
  return String(
    firstValue(booking.status, booking.booking_status) || "Unknown"
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusClass(status) {
  const value = status.toLowerCase();

  if (value.includes("confirm") || value.includes("complete")) {
    return "status-confirmed";
  }

  if (value.includes("pending")) {
    return "status-pending";
  }

  if (value.includes("cancel")) {
    return "status-cancelled";
  }

  return "status-other";
}

// Dashboard booking statistics
const totalBookings = computed(() => bookings.value.length);

const pendingBookings = computed(() =>
  bookings.value.filter(
    (booking) => bookingStatus(booking).toLowerCase().trim() === "pending"
  ).length
);

const confirmedBookings = computed(() =>
  bookings.value.filter(
    (booking) => bookingStatus(booking).toLowerCase().trim() === "confirmed"
  ).length
);

const cancelledBookings = computed(() =>
  bookings.value.filter(
    (booking) => bookingStatus(booking).toLowerCase().trim() === "cancelled"
  ).length
);

// Total destinations returned by the admin API
const totalTours = computed(() => destinations.value.length);

// Count destinations marked as published
const activeTours = computed(
  () =>
    destinations.value.filter(
      (destination) =>
        destination.is_published === true ||
        destination.is_published === 1 ||
        destination.is_published === "1"
    ).length
);

// Recent bookings
const recentBookings = computed(() =>
  [...bookings.value]
    .sort((a, b) => {
      const dateA = new Date(bookingDate(a) || 0).getTime();
      const dateB = new Date(bookingDate(b) || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 5)
);

// Bookings by tour
const tourBreakdown = computed(() => {
  const counts = new Map();

  bookings.value.forEach((booking) => {
    const name = tourName(booking);
    counts.set(name, (counts.get(name) || 0) + 1);
  });

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
});

const chartColors = ["#174D3A", "#77A567", "#F4B323", "#FF9868"];

const otherTourCount = computed(() => {
  const shown = tourBreakdown.value.reduce(
    (sum, tour) => sum + tour.count,
    0
  );

  return Math.max(0, totalBookings.value - shown);
});

const donutStyle = computed(() => {
  if (!totalBookings.value) {
    return { background: "#E5E7E5" };
  }

  let current = 0;
  const segments = [];

  tourBreakdown.value.forEach((tour, index) => {
    const start = (current / totalBookings.value) * 100;
    current += tour.count;
    const end = (current / totalBookings.value) * 100;

    segments.push(`${chartColors[index]} ${start}% ${end}%`);
  });

  if (otherTourCount.value > 0) {
    const start = (current / totalBookings.value) * 100;
    segments.push(`#D9DAD9 ${start}% 100%`);
  }

  return {
    background: `conic-gradient(${segments.join(", ")})`,
  };
});

// Bookings chart for the last seven days
const lastSevenDays = computed(() => {
  const today = new Date();
  const days = [];

  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);

    days.push({
      date,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: 0,
    });
  }

  bookings.value.forEach((booking) => {
    const rawDate = bookingDate(booking);
    if (!rawDate) return;

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return;

    const matchingDay = days.find(
      (day) => day.date.toDateString() === date.toDateString()
    );

    if (matchingDay) {
      matchingDay.count++;
    }
  });

  return days;
});

const chartMax = computed(() =>
  Math.max(
    5,
    Math.ceil(
      Math.max(...lastSevenDays.value.map((day) => day.count), 0) / 5
    ) * 5
  )
);

const bookingLinePoints = computed(() =>
  lastSevenDays.value
    .map((day, index) => {
      const x = 40 + index * (570 / 6);
      const y = 160 - (day.count / chartMax.value) * 125;

      return `${x},${y}`;
    })
    .join(" ")
);

const bookingAreaPoints = computed(
  () => `40,160 ${bookingLinePoints.value} 610,160`
);

const chartGridLines = computed(() => [
  chartMax.value,
  chartMax.value * 0.75,
  chartMax.value * 0.5,
  chartMax.value * 0.25,
  0,
]);
</script>


<template>
  <main class="dashboard">
    <!-- Success message -->
    <div v-if="successMessage" class="success-message" role="status">
      <span>✓</span>
      {{ successMessage }}
    </div>

    <!-- Welcome header -->
    <header class="welcome-header">
      <div>
        <p class="eyebrow">YOUR OVERVIEW</p>
        <h1>Welcome back, Admin</h1>
        <p class="welcome-description">
          Here's what's happening with your tours and bookings today.
        </p>
      </div>

      <div class="today-date">
        <span class="date-icon">◷</span>
        {{ new Date().toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        }) }}
      </div>
    </header>

    <!-- Errors -->
    <div v-if="loadError" class="error-message" role="alert">
      <span>{{ loadError }}</span>
      <button @click="loadBookings">Try again →</button>
    </div>

    <div v-if="destinationsError" class="error-message" role="alert">
      <span>{{ destinationsError }}</span>
      <button @click="loadDestinations">Retry destinations →</button>
    </div>

    <!-- Statistics -->
<section class="stats-grid">
  <article class="stat-card">
    <div class="stat-top">
      <span class="stat-label">Total Bookings</span>
      <span class="stat-icon green-icon">▦</span>
    </div>
    <strong class="stat-number">{{ loading ? "…" : totalBookings }}</strong>
    <span class="stat-caption">All recorded bookings</span>
  </article>

  <article class="stat-card">
    <div class="stat-top">
      <span class="stat-label">Pending Bookings</span>
      <span class="stat-icon gold-icon">◷</span>
    </div>
    <strong class="stat-number">{{ loading ? "…" : pendingBookings }}</strong>
    <span class="stat-caption">Awaiting confirmation</span>
  </article>

  <article class="stat-card">
    <div class="stat-top">
      <span class="stat-label">Confirmed Bookings</span>
      <span class="stat-icon green-icon">✓</span>
    </div>
    <strong class="stat-number">{{ loading ? "…" : confirmedBookings }}</strong>
    <span class="stat-caption">Successfully confirmed</span>
  </article>

  <article class="stat-card">
    <div class="stat-top">
      <span class="stat-label">Cancelled Bookings</span>
      <span class="stat-icon gold-icon">✕</span>
    </div>
    <strong class="stat-number">{{ loading ? "…" : cancelledBookings }}</strong>
    <span class="stat-caption">Cancelled reservations</span>
  </article>

  <article class="stat-card">
    <div class="stat-top">
      <span class="stat-label">Total Travelers</span>
      <span class="stat-icon gold-icon">♟</span>
    </div>
    <strong class="stat-number">{{ loading ? "…" : totalTravelers }}</strong>
    <span class="stat-caption">Travelers from bookings</span>
  </article>

  <article class="stat-card">
    <div class="stat-top">
      <span class="stat-label">Active Destinations</span>
      <span class="stat-icon green-icon">⌖</span>
    </div>
    <strong class="stat-number">
      {{ destinationsError ? "—" : activeTours }}
    </strong>
    <span class="stat-caption">Published destinations</span>
  </article>

  <article class="stat-card">
    <div class="stat-top">
      <span class="stat-label">Customer Reviews</span>
      <span class="stat-icon gold-icon">★</span>
    </div>
    <strong class="stat-number">—</strong>
    <span class="stat-caption">Review data not connected</span>
  </article>
</section>

    <!-- Charts -->
    <section class="analytics-grid">
      <article class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-eyebrow">PERFORMANCE</p>
            <h2>Bookings Overview</h2>
          </div>
          <span class="period-label">Last 7 days</span>
        </div>

        <div v-if="!loading && !totalBookings" class="empty-chart">
          <span>▦</span>
          <p>Booking activity will appear here when bookings are available.</p>
        </div>

        <div v-else class="line-chart">
          <svg
            viewBox="0 0 650 205"
            role="img"
            aria-label="Bookings created over the last seven days"
          >
            <defs>
              <linearGradient
                id="bookingArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stop-color="#193b2b" stop-opacity=".24" />
                <stop offset="100%" stop-color="#193b2b" stop-opacity=".01" />
              </linearGradient>
            </defs>

            <g v-for="(value, index) in chartGridLines" :key="index">
              <line
                x1="40"
                :y1="35 + index * 31.25"
                x2="610"
                :y2="35 + index * 31.25"
                stroke="#e8ebe5"
                stroke-width="1"
                stroke-dasharray="4 4"
              />
              <text
                x="5"
                :y="39 + index * 31.25"
                fill="#879087"
                font-size="11"
              >
                {{ Math.round(value) }}
              </text>
            </g>

            <polygon
              :points="bookingAreaPoints"
              fill="url(#bookingArea)"
            />

            <polyline
              :points="bookingLinePoints"
              fill="none"
              stroke="#193b2b"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g v-for="(day, index) in lastSevenDays" :key="day.label">
              <circle
                :cx="40 + index * (570 / 6)"
                :cy="160 - (day.count / chartMax) * 125"
                r="4"
                fill="#193b2b"
                stroke="#fff"
                stroke-width="2"
              />
              <text
                :x="40 + index * (570 / 6)"
                y="188"
                fill="#7c877f"
                font-size="10"
                text-anchor="middle"
              >
                {{ day.label }}
              </text>
            </g>
          </svg>
        </div>
      </article>

      <article class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-eyebrow">POPULARITY</p>
            <h2>Bookings by Tour</h2>
          </div>
        </div>

        <div v-if="!loading && !totalBookings" class="empty-chart">
          <span>◉</span>
          <p>Tour breakdown will appear when bookings are available.</p>
        </div>

        <div v-else class="donut-layout">
          <div class="donut-chart" :style="donutStyle">
            <div class="donut-hole">
              <strong>{{ loading ? "…" : totalBookings }}</strong>
              <span>Total Bookings</span>
            </div>
          </div>

          <div class="tour-legend">
            <div
              v-for="(tour, index) in tourBreakdown"
              :key="tour.name"
              class="legend-row"
            >
              <span
                class="legend-dot"
                :style="{ background: chartColors[index] }"
              ></span>
              <span class="legend-name">{{ tour.name }}</span>
              <strong class="legend-count">{{ tour.count }}</strong>
            </div>

            <div v-if="otherTourCount > 0" class="legend-row">
              <span class="legend-dot" style="background:#d9dad9"></span>
              <span class="legend-name">Other</span>
              <strong class="legend-count">{{ otherTourCount }}</strong>
            </div>

            <p v-if="!tourBreakdown.length && !loading" class="muted-text">
              Tour names are not available in the booking records.
            </p>
          </div>
        </div>
      </article>
    </section>

    <!-- Recent bookings and quick actions -->
    <section class="bottom-grid">
      <article class="panel recent-panel">
        <div class="panel-heading">
          <div>
            <p class="panel-eyebrow">LATEST ACTIVITY</p>
            <h2>Recent Bookings</h2>
          </div>

          <RouterLink to="/admin/bookings" class="view-all">
            View all <span>→</span>
          </RouterLink>
        </div>

        <div v-if="loading" class="table-message">
          Loading bookings…
        </div>

        <div v-else-if="!recentBookings.length" class="table-message">
          No bookings found yet.
        </div>

        <div v-else class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Tour</th>
                <th>Date</th>
                <th>Travelers</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="booking in recentBookings" :key="booking.id">
                <td>
                  <div class="customer-cell">
                    <span class="customer-avatar">
                      {{ customerName(booking).charAt(0).toUpperCase() }}
                    </span>
                    <div>
                      <strong>{{ customerName(booking) }}</strong>
                      <small>{{ customerEmail(booking) }}</small>
                    </div>
                  </div>
                </td>

                <td>{{ tourName(booking) }}</td>
                <td>{{ formatDate(bookingDate(booking)) }}</td>
                <td>{{ travelerCount(booking) }}</td>

                <td>
                  <span
                    class="status-pill"
                    :class="statusClass(bookingStatus(booking))"
                  >
                    {{ bookingStatus(booking) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="panel quick-panel">
        <div class="panel-heading">
          <div>
            <p class="panel-eyebrow">SHORTCUTS</p>
            <h2>Quick Actions</h2>
          </div>
        </div>

        <nav class="quick-actions" aria-label="Quick actions">
  <RouterLink to="/admin/destinations/create" class="quick-action">
    <span class="quick-icon">＋</span>
    <span>Add New Destination</span>
    <span class="action-arrow">→</span>
  </RouterLink>

  <RouterLink to="/admin/bookings" class="quick-action">
    <span class="quick-icon">▦</span>
    <span>View Bookings</span>
    <span class="action-arrow">→</span>
  </RouterLink>

  <RouterLink to="/admin/destinations" class="quick-action">
    <span class="quick-icon">♟</span>
    <span>Manage Destinations</span>
    <span class="action-arrow">→</span>
  </RouterLink>

  <RouterLink to="/admin/inquiries" class="quick-action">
    <span class="quick-icon">✉</span>
    <span>Check Inquiries</span>
    <span class="action-arrow">→</span>
  </RouterLink>
</nav>

        <RouterLink to="/admin/destinations" class="total-tours-card">
          <span class="mountain-mark">▲</span>
          <span class="total-tours-info">
            <small>Total Destinations</small>
            <strong>{{ destinationsError ? "—" : totalTours }}</strong>
            <small>
              {{ destinationsError ? "Unable to load data" : "All destinations" }}
            </small>
          </span>
          <span class="action-arrow">→</span>
        </RouterLink>
      </article>
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  --forest: #193b2b;
  --forest-dark: #10271e;
  --gold: #9b8051;
  --muted: #788279;
  --line: #e9e9e1;
  color: var(--forest-dark);
  min-width: 0;
  padding: 8px 0 28px;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  padding: 13px 17px;
  border: 1px solid #c8dfca;
  border-radius: 12px;
  background: #edf6ed;
  color: #28633c;
  font-size: 13px;
}

.success-message span {
  font-weight: 800;
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 27px;
}

.eyebrow,
.panel-eyebrow {
  margin: 0 0 7px;
  color: var(--gold);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
}

.welcome-header h1 {
  margin: 0;
  color: var(--forest);
  font-family: Georgia, serif;
  font-size: clamp(26px, 3vw, 35px);
  font-weight: 500;
  letter-spacing: -0.8px;
}

.welcome-description {
  margin: 9px 0 0;
  color: #778078;
  font-size: 13px;
}

.today-date {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 14px;
  border: 1px solid #e8e8df;
  border-radius: 10px;
  background: #fff;
  color: #59685e;
  font-size: 12px;
  white-space: nowrap;
}

.date-icon {
  color: var(--gold);
  font-size: 18px;
}

.error-message {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 15px 0;
  padding: 13px 15px;
  border: 1px solid #f0caca;
  border-radius: 10px;
  background: #fff4f4;
  color: #a33434;
  font-size: 13px;
}

.error-message button {
  color: inherit;
  font-weight: 700;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 19px;
}

.stat-card,
.panel {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 5px 18px rgb(25 59 43 / 3%);
}

.stat-card {
  padding: 19px;
  transition: transform .2s, box-shadow .2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 9px 23px rgb(25 59 43 / 7%);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.stat-label {
  color: #718076;
  font-size: 12px;
}

.stat-icon {
  display: grid;
  width: 39px;
  height: 39px;
  place-items: center;
  border-radius: 11px;
  font-size: 19px;
}

.green-icon {
  background: #edf3eb;
  color: var(--forest);
}

.gold-icon {
  background: #f6f0e4;
  color: var(--gold);
}

.stat-number {
  display: block;
  margin-top: 15px;
  color: var(--forest);
  font-family: Georgia, serif;
  font-size: 32px;
  font-weight: 500;
  line-height: 1;
}

.stat-caption {
  display: block;
  margin-top: 9px;
  color: #929a92;
  font-size: 11px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 18px;
  margin-bottom: 19px;
}

.bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(270px, .9fr);
  gap: 18px;
}

.panel {
  padding: 21px;
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 19px;
}

.panel-eyebrow {
  margin-bottom: 5px;
  font-size: 9px;
  letter-spacing: 1.6px;
}

.panel-heading h2 {
  margin: 0;
  color: var(--forest);
  font-family: Georgia, serif;
  font-size: 19px;
  font-weight: 500;
}

.period-label {
  padding: 8px 11px;
  border: 1px solid #e8e8df;
  border-radius: 8px;
  color: #66746a;
  font-size: 11px;
  white-space: nowrap;
}

.line-chart {
  width: 100%;
}

.line-chart svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.empty-chart {
  display: grid;
  min-height: 180px;
  place-content: center;
  justify-items: center;
  gap: 10px;
  color: #89938b;
  text-align: center;
  font-size: 12px;
}

.empty-chart span {
  color: #b5c5b6;
  font-size: 30px;
}

.empty-chart p {
  max-width: 260px;
  margin: 0;
}

.donut-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: 190px;
}

.donut-chart {
  display: grid;
  flex: 0 0 165px;
  width: 165px;
  height: 165px;
  place-items: center;
  border-radius: 50%;
}

.donut-hole {
  display: flex;
  width: 99px;
  height: 99px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;
}

.donut-hole strong {
  color: var(--forest);
  font-family: Georgia, serif;
  font-size: 27px;
  font-weight: 500;
}

.donut-hole span {
  margin-top: 3px;
  color: #89938b;
  font-size: 9px;
}

.tour-legend {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 15px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  font-size: 11px;
}

.legend-dot {
  flex: 0 0 9px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.legend-name {
  flex: 1;
  overflow: hidden;
  color: #536258;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-count {
  color: var(--forest);
  font-size: 11px;
}

.muted-text {
  color: #89938b;
  font-size: 11px;
}

.view-all {
  color: var(--forest);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.view-all:hover {
  color: var(--gold);
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  white-space: nowrap;
}

thead {
  background: #f8f8f4;
}

th {
  padding: 12px 9px;
  color: #849087;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .7px;
  text-transform: uppercase;
}

td {
  padding: 13px 9px;
  border-bottom: 1px solid #eff0eb;
  color: #536258;
  font-size: 11px;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 9px;
}

.customer-avatar {
  display: grid;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 50%;
  background: #edf2e9;
  color: var(--forest);
  font-size: 12px;
  font-weight: 700;
}

.customer-cell strong,
.customer-cell small {
  display: block;
}

.customer-cell strong {
  max-width: 145px;
  overflow: hidden;
  color: var(--forest);
  font-size: 11px;
  font-weight: 600;
  text-overflow: ellipsis;
}

.customer-cell small {
  max-width: 145px;
  margin-top: 3px;
  overflow: hidden;
  color: #929b94;
  font-size: 10px;
  text-overflow: ellipsis;
}

.status-pill {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
}

.status-confirmed {
  background: #e5f1e5;
  color: #28633c;
}

.status-pending {
  background: #f8f0df;
  color: #936018;
}

.status-cancelled {
  background: #fbe9e7;
  color: #a23e36;
}

.status-other {
  background: #eff0ec;
  color: #5f7066;
}

.table-message {
  padding: 40px 12px;
  color: #89938b;
  text-align: center;
  font-size: 12px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 46px;
  padding: 9px 11px;
  border: 1px solid #eceee8;
  border-radius: 9px;
  color: #41564a;
  font-size: 12px;
  text-decoration: none;
  transition: background .2s, border-color .2s;
}

.quick-action:hover {
  border-color: #cbd9ca;
  background: #f5f8f2;
}

.quick-icon {
  display: grid;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 8px;
  background: #edf3eb;
  color: var(--forest);
  font-size: 17px;
}

.action-arrow {
  margin-left: auto;
  color: #849087;
  font-size: 17px;
}

.total-tours-card {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 22px;
  padding: 15px;
  border: 1px solid #e6e9df;
  border-radius: 10px;
  background: #f4f5ee;
  color: var(--forest);
  text-decoration: none;
  transition: background .2s;
}

.total-tours-card:hover {
  background: #edf1e7;
}

.mountain-mark {
  color: var(--gold);
  font-size: 26px;
}

.total-tours-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-tours-info small {
  color: #78847b;
  font-size: 10px;
}

.total-tours-info strong {
  font-family: Georgia, serif;
  font-size: 23px;
  font-weight: 500;
}

@media (max-width: 1150px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .donut-layout {
    flex-wrap: wrap;
  }
}

@media (max-width: 850px) {
  .analytics-grid,
  .bottom-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .donut-layout {
    flex-wrap: nowrap;
  }
}

@media (max-width: 600px) {
  .welcome-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .today-date {
    font-size: 11px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .stat-card {
    padding: 14px;
  }

  .stat-number {
    font-size: 27px;
  }

  .stat-label {
    font-size: 11px;
  }

  .stat-icon {
    width: 33px;
    height: 33px;
    font-size: 16px;
  }

  .panel {
    padding: 15px;
  }

  .donut-layout {
    align-items: center;
    flex-direction: column;
  }

  .tour-legend {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .stats-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
