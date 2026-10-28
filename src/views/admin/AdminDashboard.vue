
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

// Dashboard statistics
const totalBookings = computed(() => bookings.value.length);

const totalTravelers = computed(() =>
  bookings.value.reduce(
    (total, booking) => total + travelerCount(booking),
    0
  )
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
    <div
      v-if="successMessage"
      class="success-message"
      role="status"
    >
      {{ successMessage }}
    </div>

    <header class="welcome-header">
      <div>
        <h1>Good morning, Admin 👋</h1>
        <p>
          Here's what's happening with your tours and bookings today.
        </p>
      </div>

      <span class="today-date">
        {{ new Date().toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        }) }}
      </span>
    </header>

    <div v-if="loadError" class="error-message" role="alert">
      <span>{{ loadError }}</span>
      <button class="text-button" @click="loadBookings">
        Try again
      </button>
    </div>

    <div
      v-if="destinationsError"
      class="error-message"
      role="alert"
    >
      <span>{{ destinationsError }}</span>
      <button class="text-button" @click="loadDestinations">
        Retry destinations
      </button>
    </div>

    <!-- Statistics cards -->
    <section class="stats-grid" aria-label="Dashboard statistics">
      <article class="stat-card">
        <div class="stat-icon icon-green">▦</div>

        <div class="stat-content">
          <p>Total Bookings</p>
          <strong>{{ loading ? "…" : totalBookings }}</strong>
          <span class="stat-caption">
            All recorded bookings
          </span>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon icon-sage">♟</div>

        <div class="stat-content">
          <p>Total Travelers</p>
          <strong>{{ loading ? "…" : totalTravelers }}</strong>
          <span class="stat-caption">
            From recorded bookings
          </span>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon icon-green">⌖</div>

        <div class="stat-content">
          <p>Active Tours</p>
          <strong>
            {{ destinationsError ? "—" : activeTours }}
          </strong>
          <span class="stat-caption">
            {{ destinationsError
              ? "Unable to load tour data"
              : "Published destinations" }}
          </span>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon icon-gold">★</div>

        <div class="stat-content">
          <p>Customer Reviews</p>
          <strong>—</strong>
          <span class="stat-caption">
            Review data not connected yet
          </span>
        </div>
      </article>
    </section>

    <!-- Analytics -->
    <section class="analytics-grid">
      <article class="panel bookings-chart-panel">
        <div class="panel-heading">
          <h2>Bookings Overview</h2>
          <span class="period-label">Last 7 days</span>
        </div>

        <div
          v-if="!loading && !totalBookings"
          class="empty-chart"
        >
          Booking activity will appear here when bookings are available.
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
                <stop
                  offset="0%"
                  stop-color="#78A887"
                  stop-opacity=".35"
                />
                <stop
                  offset="100%"
                  stop-color="#78A887"
                  stop-opacity=".03"
                />
              </linearGradient>
            </defs>

            <g
              v-for="(value, index) in chartGridLines"
              :key="index"
            >
              <line
                x1="40"
                :y1="35 + index * 31.25"
                x2="610"
                :y2="35 + index * 31.25"
                stroke="#E7EAE6"
                stroke-width="1"
              />

              <text
                x="5"
                :y="39 + index * 31.25"
                fill="#708078"
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
              stroke="#23764E"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g
              v-for="(day, index) in lastSevenDays"
              :key="day.label"
            >
              <circle
                :cx="40 + index * (570 / 6)"
                :cy="160 - (day.count / chartMax) * 125"
                r="4"
                fill="#23764E"
              />

              <text
                :x="40 + index * (570 / 6)"
                y="188"
                fill="#66776E"
                font-size="10"
                text-anchor="middle"
              >
                {{ day.label }}
              </text>
            </g>
          </svg>
        </div>
      </article>

      <article class="panel tour-chart-panel">
        <div class="panel-heading">
          <h2>Bookings by Tour</h2>
        </div>

        <div
          v-if="!loading && !totalBookings"
          class="empty-chart"
        >
          Tour breakdown will appear when bookings are available.
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
              <span class="legend-count">{{ tour.count }}</span>
            </div>

            <div
              v-if="otherTourCount > 0"
              class="legend-row"
            >
              <span
                class="legend-dot"
                style="background: #D9DAD9"
              ></span>
              <span class="legend-name">Other</span>
              <span class="legend-count">{{ otherTourCount }}</span>
            </div>

            <p
              v-if="!tourBreakdown.length && !loading"
              class="muted-text"
            >
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
          <h2>Recent Bookings</h2>

          <RouterLink to="/admin/bookings" class="view-all">
            View all <span>→</span>
          </RouterLink>
        </div>

        <div v-if="loading" class="table-message">
          Loading bookings…
        </div>

        <div
          v-else-if="!recentBookings.length"
          class="table-message"
        >
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
              <tr
                v-for="booking in recentBookings"
                :key="booking.id"
              >
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
          <h2>Quick Actions</h2>
        </div>

        <nav class="quick-actions" aria-label="Quick actions">
          <RouterLink
            to="/admin/tour-packages"
            class="quick-action"
          >
            <span class="quick-icon">＋</span>
            <span>Add New Tour</span>
            <span class="action-arrow">›</span>
          </RouterLink>

          <RouterLink
            to="/admin/bookings"
            class="quick-action"
          >
            <span class="quick-icon">▦</span>
            <span>View Bookings</span>
            <span class="action-arrow">›</span>
          </RouterLink>

          <RouterLink
            to="/admin/customers"
            class="quick-action"
          >
            <span class="quick-icon">♟</span>
            <span>Manage Customers</span>
            <span class="action-arrow">›</span>
          </RouterLink>

          <RouterLink
            to="/admin/messages"
            class="quick-action"
          >
            <span class="quick-icon">▤</span>
            <span>Check Messages</span>
            <span class="action-arrow">›</span>
          </RouterLink>
        </nav>

        <RouterLink
          to="/admin/tour-packages"
          class="total-tours-card"
        >
          <span class="mountain-mark">▲</span>

          <span>
            <small>Total Tours</small>

            <strong>
              {{ destinationsError ? "—" : totalTours }}
            </strong>

            <small class="tour-note">
              {{ destinationsError
                ? "Unable to load tour data"
                : "All destinations" }}
            </small>
          </span>

          <span class="action-arrow">›</span>
        </RouterLink>
      </article>
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  --forest: #174b38;
  --forest-light: #26734f;
  --ink: #17382b;
  --muted: #687970;
  --line: #e8ebe6;
  --surface: #fff;

  color: var(--ink);
  padding: 24px 28px 32px;
  min-width: 0;
}

.success-message {
  margin-bottom: 20px;
  padding: 12px 16px;
  border: 1px solid #bbdfc5;
  border-radius: 10px;
  background: #effaf1;
  color: #21683b;
  font-size: 14px;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 18px 0;
  padding: 12px 16px;
  border: 1px solid #f0c8c8;
  border-radius: 10px;
  background: #fff4f4;
  color: #a33434;
  font-size: 13px;
}

.text-button {
  border: 0;
  background: transparent;
  color: inherit;
  font-weight: 700;
  cursor: pointer;
}

.welcome-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.welcome-header h1 {
  margin: 0;
  color: #163f30;
  font-size: clamp(22px, 2vw, 28px);
  font-weight: 700;
  letter-spacing: -0.7px;
}

.welcome-header p {
  margin: 7px 0 0;
  color: #61746d;
  font-size: 14px;
}

.today-date {
  flex-shrink: 0;
  color: #60766d;
  font-size: 13px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}

.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-width: 0;
  padding: 22px 20px;
  border: 1px solid #eeefeb;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.91);
  box-shadow: 0 3px 12px rgb(25 54 40 / 3%);
}

.stat-icon {
  display: grid;
  flex: 0 0 54px;
  width: 54px;
  height: 54px;
  place-items: center;
  border-radius: 12px;
  font-size: 27px;
  font-weight: 700;
}

.icon-green {
  background: #e8efe5;
  color: #216849;
}

.icon-sage {
  background: #e9f0e7;
  color: #38764e;
}

.icon-gold {
  background: #f7f0d9;
  color: #9d7a17;
}

.stat-content {
  min-width: 0;
}

.stat-content p {
  margin: 3px 0 8px;
  color: #65766e;
  font-size: 13px;
}

.stat-content strong {
  display: block;
  color: #173b2c;
  font-size: 29px;
  line-height: 1.1;
  font-weight: 700;
}

.stat-caption {
  display: block;
  margin-top: 9px;
  color: #7c8982;
  font-size: 11px;
  line-height: 1.4;
}

.analytics-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 18px;
  margin-bottom: 18px;
}

.bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.9fr);
  gap: 18px;
}

.panel {
  min-width: 0;
  padding: 20px;
  border: 1px solid #eeefeb;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 3px 12px rgb(25 54 40 / 3%);
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.panel-heading h2 {
  margin: 0;
  color: #183b2d;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.25px;
}

.period-label {
  padding: 7px 10px;
  border: 1px solid #e5e9e4;
  border-radius: 8px;
  color: #314c3e;
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
  place-items: center;
  padding: 20px;
  color: #78857e;
  text-align: center;
  font-size: 13px;
}

.donut-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 26px;
  min-height: 190px;
}

.donut-chart {
  display: grid;
  flex: 0 0 170px;
  width: 170px;
  height: 170px;
  place-items: center;
  border-radius: 50%;
}

.donut-hole {
  display: flex;
  width: 100px;
  height: 100px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;
}

.donut-hole strong {
  color: #173b2c;
  font-size: 25px;
}

.donut-hole span {
  margin-top: 4px;
  color: #718078;
  font-size: 10px;
  text-align: center;
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
  flex: 0 0 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-name {
  flex: 1;
  overflow: hidden;
  color: #30473c;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-count {
  color: #6f7f76;
  font-variant-numeric: tabular-nums;
}

.muted-text {
  color: #77857d;
  font-size: 12px;
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #216b49;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.view-all:hover {
  color: #123d2b;
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
  background: #f8f9f7;
}

th {
  padding: 11px 9px;
  color: #718078;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

td {
  padding: 12px 9px;
  border-bottom: 1px solid #edf0ec;
  color: #4b6156;
  font-size: 11px;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-avatar {
  display: grid;
  flex: 0 0 31px;
  width: 31px;
  height: 31px;
  place-items: center;
  border-radius: 50%;
  background: #dce8d7;
  color: #35664b;
  font-size: 12px;
  font-weight: 600;
}

.customer-cell strong,
.customer-cell small {
  display: block;
}

.customer-cell strong {
  max-width: 150px;
  overflow: hidden;
  color: #1e382c;
  font-size: 11px;
  font-weight: 600;
  text-overflow: ellipsis;
}

.customer-cell small {
  max-width: 150px;
  margin-top: 3px;
  overflow: hidden;
  color: #8a9690;
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
  background: #dcefe1;
  color: #21683c;
}

.status-pending {
  background: #fff0d5;
  color: #936018;
}

.status-cancelled {
  background: #fbe3e1;
  color: #a23e36;
}

.status-other {
  background: #edf0ed;
  color: #5f7066;
}

.table-message {
  padding: 40px 12px;
  color: #78867e;
  text-align: center;
  font-size: 13px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 42px;
  padding: 8px 11px;
  border: 1px solid #e7eae5;
  border-radius: 9px;
  color: #2b4638;
  font-size: 12px;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}

.quick-action:hover {
  border-color: #c9d8cc;
  background: #f7faf6;
}

.quick-icon {
  display: grid;
  flex: 0 0 25px;
  width: 25px;
  height: 25px;
  place-items: center;
  border-radius: 50%;
  background: #edf2eb;
  color: #286747;
  font-size: 18px;
}

.action-arrow {
  margin-left: auto;
  color: #688176;
  font-size: 22px;
}

.total-tours-card {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 25px;
  padding: 15px;
  border-radius: 9px;
  background: #edf2e8;
  color: #173d2c;
  text-decoration: none;
}

.mountain-mark {
  color: #1b5b3f;
  font-size: 27px;
}

.total-tours-card > span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-tours-card small {
  font-size: 11px;
}

.total-tours-card strong {
  font-size: 22px;
}

.total-tours-card .tour-note {
  color: #78867e;
  font-size: 10px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .donut-layout {
    flex-wrap: wrap;
  }
}

@media (max-width: 850px) {
  .dashboard {
    padding: 20px 16px;
  }

  .analytics-grid,
  .bottom-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .donut-layout {
    flex-wrap: nowrap;
  }
}

@media (max-width: 520px) {
  .welcome-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .stat-card {
    padding: 17px;
  }

  .donut-layout {
    align-items: center;
    flex-direction: column;
  }

  .tour-legend {
    width: 100%;
  }

  .panel {
    padding: 15px;
  }
}
</style>
