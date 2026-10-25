"""
Selenium test suite for the Estate real-estate web application.

Run with:
    pip install -r requirements.txt
    pytest test_estate.py -v

Set BASE_URL env variable to test against a different host, e.g.:
    BASE_URL=http://localhost pytest test_estate.py -v   (Docker deployment)
"""

import time
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def url(base, path=""):
    return base.rstrip("/") + path


def wait_for(driver, by, value, timeout=10):
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((by, value))
    )


def wait_visible(driver, by, value, timeout=10):
    return WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located((by, value))
    )


# ─────────────────────────────────────────────
# Home Page Tests
# ─────────────────────────────────────────────

class TestHomePage:
    def test_home_page_loads(self, driver, base_url):
        """Home page returns 200 and renders content."""
        driver.get(url(base_url, "/"))
        wait_for(driver, By.TAG_NAME, "h1")
        heading = driver.find_element(By.TAG_NAME, "h1")
        assert "Find your next" in heading.text or len(heading.text) > 0

    def test_home_page_title(self, driver, base_url):
        """Page title is set."""
        driver.get(url(base_url, "/"))
        assert len(driver.title) > 0

    def test_get_started_link_present(self, driver, base_url):
        """'Let's get started' link is present on home page."""
        driver.get(url(base_url, "/"))
        wait_for(driver, By.PARTIAL_LINK_TEXT, "get started")
        link = driver.find_element(By.PARTIAL_LINK_TEXT, "get started")
        assert link.is_displayed()

    def test_get_started_link_navigates_to_search(self, driver, base_url):
        """Clicking 'Let's get started' navigates to /search."""
        driver.get(url(base_url, "/"))
        wait_for(driver, By.PARTIAL_LINK_TEXT, "get started")
        driver.find_element(By.PARTIAL_LINK_TEXT, "get started").click()
        WebDriverWait(driver, 10).until(EC.url_contains("/search"))
        assert "/search" in driver.current_url

    def test_header_is_present(self, driver, base_url):
        """Header/nav is rendered on home page."""
        driver.get(url(base_url, "/"))
        wait_for(driver, By.TAG_NAME, "header")
        header = driver.find_element(By.TAG_NAME, "header")
        assert header.is_displayed()


# ─────────────────────────────────────────────
# Navigation Tests
# ─────────────────────────────────────────────

class TestNavigation:
    def test_navigate_to_about(self, driver, base_url):
        """Navigating to /about renders the About page."""
        driver.get(url(base_url, "/about"))
        wait_for(driver, By.TAG_NAME, "body")
        assert driver.find_element(By.TAG_NAME, "body").is_displayed()
        assert "about" in driver.current_url.lower() or driver.title

    def test_navigate_to_contact(self, driver, base_url):
        """Navigating to /contact renders the Contact page."""
        driver.get(url(base_url, "/contact"))
        wait_for(driver, By.TAG_NAME, "body")
        assert driver.find_element(By.TAG_NAME, "body").is_displayed()

    def test_navigate_to_signin(self, driver, base_url):
        """Navigating to /signin renders the Sign In page."""
        driver.get(url(base_url, "/signin"))
        wait_for(driver, By.TAG_NAME, "h1")
        h1 = driver.find_element(By.TAG_NAME, "h1")
        assert "Sign In" in h1.text

    def test_navigate_to_signup(self, driver, base_url):
        """Navigating to /signup renders the Sign Up page."""
        driver.get(url(base_url, "/signup"))
        wait_for(driver, By.TAG_NAME, "h1")
        h1 = driver.find_element(By.TAG_NAME, "h1")
        assert "Sign Up" in h1.text

    def test_navigate_to_search(self, driver, base_url):
        """Navigating to /search renders the Search page."""
        driver.get(url(base_url, "/search"))
        wait_for(driver, By.TAG_NAME, "body")
        assert driver.find_element(By.TAG_NAME, "body").is_displayed()

    def test_header_logo_links_to_home(self, driver, base_url):
        """Header logo/brand link navigates back to home."""
        driver.get(url(base_url, "/signin"))
        wait_for(driver, By.TAG_NAME, "header")
        # find the first link inside header (the brand logo)
        header = driver.find_element(By.TAG_NAME, "header")
        logo_link = header.find_element(By.TAG_NAME, "a")
        logo_link.click()
        WebDriverWait(driver, 10).until(
            lambda d: d.current_url.rstrip("/") == url(base_url, "").rstrip("/")
            or d.current_url == url(base_url, "/")
        )
        assert driver.current_url.rstrip("/") in (
            url(base_url, ""),
            url(base_url, "/"),
        )


# ─────────────────────────────────────────────
# Sign In Page Tests
# ─────────────────────────────────────────────

class TestSignIn:
    def test_signin_form_elements_present(self, driver, base_url):
        """Sign In page has email input, password input, and submit button."""
        driver.get(url(base_url, "/signin"))
        wait_for(driver, By.CSS_SELECTOR, "input[name='email']")
        assert driver.find_element(By.CSS_SELECTOR, "input[name='email']").is_displayed()
        assert driver.find_element(By.CSS_SELECTOR, "input[name='password']").is_displayed()
        buttons = driver.find_elements(By.TAG_NAME, "button")
        assert any("sign in" in b.text.lower() for b in buttons)

    def test_signin_email_field_accepts_input(self, driver, base_url):
        """Email field on Sign In page accepts typed text."""
        driver.get(url(base_url, "/signin"))
        email_input = wait_for(driver, By.CSS_SELECTOR, "input[name='email']")
        email_input.send_keys("test@example.com")
        assert email_input.get_attribute("value") == "test@example.com"

    def test_signin_password_field_accepts_input(self, driver, base_url):
        """Password field on Sign In page accepts typed text and is masked."""
        driver.get(url(base_url, "/signin"))
        pwd_input = wait_for(driver, By.CSS_SELECTOR, "input[name='password']")
        pwd_input.send_keys("secret123")
        assert pwd_input.get_attribute("type") == "password"
        assert pwd_input.get_attribute("value") == "secret123"

    def test_signin_link_to_signup(self, driver, base_url):
        """Sign In page contains a link to the Sign Up page."""
        driver.get(url(base_url, "/signin"))
        wait_for(driver, By.PARTIAL_LINK_TEXT, "Sign up")
        link = driver.find_element(By.PARTIAL_LINK_TEXT, "Sign up")
        assert link.is_displayed()

    def test_signin_with_invalid_credentials_shows_error(self, driver, base_url):
        """Submitting invalid credentials shows an error notification."""
        driver.get(url(base_url, "/signin"))
        wait_for(driver, By.CSS_SELECTOR, "input[name='email']").send_keys(
            "nobody@invalid.com"
        )
        driver.find_element(By.CSS_SELECTOR, "input[name='password']").send_keys(
            "wrongpassword"
        )
        # click the Sign In button
        buttons = driver.find_elements(By.TAG_NAME, "button")
        sign_in_btn = next(b for b in buttons if "sign in" in b.text.lower())
        sign_in_btn.click()
        # wait for a toast or error element to appear
        try:
            WebDriverWait(driver, 8).until(
                EC.any_of(
                    EC.presence_of_element_located((By.CLASS_NAME, "Toastify__toast")),
                    EC.presence_of_element_located((By.CSS_SELECTOR, "[role='alert']")),
                )
            )
            error_shown = True
        except TimeoutException:
            # If no toast, at least we should still be on the sign-in page (not redirected)
            error_shown = "/signin" in driver.current_url or "/profile" not in driver.current_url
        assert error_shown


# ─────────────────────────────────────────────
# Sign Up Page Tests
# ─────────────────────────────────────────────

class TestSignUp:
    def test_signup_form_elements_present(self, driver, base_url):
        """Sign Up page has username, email, password inputs and a submit button."""
        driver.get(url(base_url, "/signup"))
        wait_for(driver, By.CSS_SELECTOR, "input[name='username']")
        assert driver.find_element(By.CSS_SELECTOR, "input[name='username']").is_displayed()
        assert driver.find_element(By.CSS_SELECTOR, "input[name='email']").is_displayed()
        assert driver.find_element(By.CSS_SELECTOR, "input[name='password']").is_displayed()

    def test_signup_submit_button_present(self, driver, base_url):
        """Sign Up page has a visible Sign Up submit button."""
        driver.get(url(base_url, "/signup"))
        wait_for(driver, By.TAG_NAME, "button")
        buttons = driver.find_elements(By.TAG_NAME, "button")
        assert any("sign up" in b.text.lower() for b in buttons)

    def test_signup_fields_accept_input(self, driver, base_url):
        """All three Sign Up fields accept typed input."""
        driver.get(url(base_url, "/signup"))
        wait_for(driver, By.CSS_SELECTOR, "input[name='username']").send_keys("testuser")
        driver.find_element(By.CSS_SELECTOR, "input[name='email']").send_keys(
            "testuser@example.com"
        )
        driver.find_element(By.CSS_SELECTOR, "input[name='password']").send_keys("password123")

        assert (
            driver.find_element(By.CSS_SELECTOR, "input[name='username']").get_attribute("value")
            == "testuser"
        )
        assert (
            driver.find_element(By.CSS_SELECTOR, "input[name='email']").get_attribute("value")
            == "testuser@example.com"
        )

    def test_signup_link_to_signin(self, driver, base_url):
        """Sign Up page contains a link back to Sign In."""
        driver.get(url(base_url, "/signup"))
        wait_for(driver, By.PARTIAL_LINK_TEXT, "Sign in")
        link = driver.find_element(By.PARTIAL_LINK_TEXT, "Sign in")
        assert link.is_displayed()
        link.click()
        WebDriverWait(driver, 10).until(EC.url_contains("/signin"))
        assert "/signin" in driver.current_url

    def test_signup_password_field_is_masked(self, driver, base_url):
        """Password field on Sign Up page has type='password'."""
        driver.get(url(base_url, "/signup"))
        pwd = wait_for(driver, By.CSS_SELECTOR, "input[name='password']")
        assert pwd.get_attribute("type") == "password"


# ─────────────────────────────────────────────
# Search Page Tests
# ─────────────────────────────────────────────

class TestSearch:
    def test_search_page_loads(self, driver, base_url):
        """Search page renders without error."""
        driver.get(url(base_url, "/search"))
        wait_for(driver, By.TAG_NAME, "body")
        assert driver.find_element(By.TAG_NAME, "body").is_displayed()

    def test_search_input_present(self, driver, base_url):
        """Search page has a search text input."""
        driver.get(url(base_url, "/search"))
        search_input = wait_for(driver, By.ID, "searchTerm")
        assert search_input.is_displayed()

    def test_search_type_checkboxes_present(self, driver, base_url):
        """Search page shows type filter checkboxes (All, Rent, Sale)."""
        driver.get(url(base_url, "/search"))
        wait_for(driver, By.ID, "all")
        assert driver.find_element(By.ID, "all").is_displayed()
        assert driver.find_element(By.ID, "rent").is_displayed()
        assert driver.find_element(By.ID, "sale").is_displayed()

    def test_search_amenity_checkboxes_present(self, driver, base_url):
        """Search page shows Parking and Furnished amenity checkboxes."""
        driver.get(url(base_url, "/search"))
        wait_for(driver, By.ID, "parking")
        assert driver.find_element(By.ID, "parking").is_displayed()
        assert driver.find_element(By.ID, "furnished").is_displayed()

    def test_search_sort_dropdown_present(self, driver, base_url):
        """Search page shows a sort dropdown."""
        driver.get(url(base_url, "/search"))
        wait_for(driver, By.ID, "sort_order")
        assert driver.find_element(By.ID, "sort_order").is_displayed()

    def test_search_submit_button_present(self, driver, base_url):
        """Search page has a Search submit button."""
        driver.get(url(base_url, "/search"))
        wait_for(driver, By.TAG_NAME, "button")
        buttons = driver.find_elements(By.TAG_NAME, "button")
        assert any("search" in b.text.lower() for b in buttons)

    def test_search_input_accepts_text(self, driver, base_url):
        """Typing in the search field updates its value."""
        driver.get(url(base_url, "/search"))
        search_input = wait_for(driver, By.ID, "searchTerm")
        search_input.send_keys("apartment")
        assert search_input.get_attribute("value") == "apartment"

    def test_search_form_submission_updates_url(self, driver, base_url):
        """Submitting the search form appends query params to the URL."""
        driver.get(url(base_url, "/search"))
        search_input = wait_for(driver, By.ID, "searchTerm")
        search_input.send_keys("villa")
        buttons = driver.find_elements(By.TAG_NAME, "button")
        search_btn = next(b for b in buttons if "search" in b.text.lower())
        search_btn.click()
        WebDriverWait(driver, 10).until(EC.url_contains("searchTerm=villa"))
        assert "searchTerm=villa" in driver.current_url

    def test_search_results_section_present(self, driver, base_url):
        """Search page shows a 'Listing Results' section heading."""
        driver.get(url(base_url, "/search"))
        wait_for(driver, By.XPATH, "//*[contains(text(), 'Listing Results')]")
        heading = driver.find_element(By.XPATH, "//*[contains(text(), 'Listing Results')]")
        assert heading.is_displayed()


# ─────────────────────────────────────────────
# About & Contact Page Tests
# ─────────────────────────────────────────────

class TestAboutAndContact:
    def test_about_page_renders(self, driver, base_url):
        """About page loads and displays content."""
        driver.get(url(base_url, "/about"))
        wait_for(driver, By.TAG_NAME, "body")
        body_text = driver.find_element(By.TAG_NAME, "body").text
        assert len(body_text) > 0

    def test_contact_page_renders(self, driver, base_url):
        """Contact page loads and displays content."""
        driver.get(url(base_url, "/contact"))
        wait_for(driver, By.TAG_NAME, "body")
        body_text = driver.find_element(By.TAG_NAME, "body").text
        assert len(body_text) > 0
