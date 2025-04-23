import css from 'styled-jsx/css'

export default css`
    /* DHIS2-inspired grid layout and card styling */
.home-container {
  padding: 24px;
  background-color: #f5f5f5; /* DHIS2 neutral background */
  min-height: 100vh;
}

.home-title {
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #212934; /* DHIS2 primary text */
  margin-bottom: 24px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 16px; /* DHIS2 spacing */
}

.nav-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0; /* DHIS2 card border */
  border-radius: 4px;
  transition: box-shadow 0.2s ease;
}

.nav-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* DHIS2 hover effect */
}

.nav-card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-card-icon {
  color: #2c6693; /* DHIS2 primary color */
}

.nav-card-title {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #212934;
  margin: 0;
}

.nav-card-text {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #6e6e6e; /* DHIS2 secondary text */
  line-height: 1.5;
  margin: 0;
}

.nav-card-button {
  align-self: flex-start;
  font-size: 14px;
}
`
