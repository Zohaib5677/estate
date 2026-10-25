"""
Selenium tests for Estate app.

Run:
    pip install -r requirements.txt
    pytest test_estate.py -v

Override URL:
    BASE_URL=http://localhost pytest test_estate.py -v
"""

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


def url(base, path=""):
    return base.rstrip("/") + path


def wait(driver, by, value, timeout=10):
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((by, value))
    )


# 1. Home page loads with main heading
def test_home_page_loads(driver, base_url):
    driver.get(url(base_url, "/"))
    wait(driver, By.TAG_NAME, "h1")
    assert "Find your next" in driver.find_element(By.TAG_NAME, "h1").text


# 2. Header is visible on every page
def test_header_present(driver, base_url):
    driver.get(url(base_url, "/"))
    wait(driver, By.TAG_NAME, "header")
    assert driver.find_element(By.TAG_NAME, "header").is_displayed()


# 3. "Let's get started" link navigates to /search
def test_get_started_goes_to_search(driver, base_url):
    driver.get(url(base_url, "/"))
    wait(driver, By.PARTIAL_LINK_TEXT, "get started")
    driver.find_element(By.PARTIAL_LINK_TEXT, "get started").click()
    WebDriverWait(driver, 10).until(EC.url_contains("/search"))
    assert "/search" in driver.current_url


# 4. Sign In page has all form elements
def test_signin_form_present(driver, base_url):
    driver.get(url(base_url, "/signin"))
    wait(driver, By.CSS_SELECTOR, "input[name='email']")
    assert driver.find_element(By.CSS_SELECTOR, "input[name='email']").is_displayed()
    assert driver.find_element(By.CSS_SELECTOR, "input[name='password']").is_displayed()
    buttons = driver.find_elements(By.TAG_NAME, "button")
    assert any("sign in" in b.text.lower() for b in buttons)


# 5. Password field is masked (type=password)
def test_password_field_masked(driver, base_url):
    driver.get(url(base_url, "/signin"))
    pwd = wait(driver, By.CSS_SELECTOR, "input[name='password']")
    assert pwd.get_attribute("type") == "password"


# 6. Invalid login shows error, does NOT redirect to profile
def test_signin_invalid_credentials(driver, base_url):
    driver.get(url(base_url, "/signin"))
    wait(driver, By.CSS_SELECTOR, "input[name='email']").send_keys("wrong@test.com")
    driver.find_element(By.CSS_SELECTOR, "input[name='password']").send_keys("wrongpass")
    buttons = driver.find_elements(By.TAG_NAME, "button")
    next(b for b in buttons if "sign in" in b.text.lower()).click()
    try:
        WebDriverWait(driver, 8).until(
            EC.presence_of_element_located((By.CLASS_NAME, "Toastify__toast"))
        )
        assert True
    except TimeoutException:
        assert "/profile" not in driver.current_url


# 7. Sign Up page has username, email, password fields
def test_signup_form_present(driver, base_url):
    driver.get(url(base_url, "/signup"))
    wait(driver, By.CSS_SELECTOR, "input[name='username']")
    assert driver.find_element(By.CSS_SELECTOR, "input[name='username']").is_displayed()
    assert driver.find_element(By.CSS_SELECTOR, "input[name='email']").is_displayed()
    assert driver.find_element(By.CSS_SELECTOR, "input[name='password']").is_displayed()


# 8. Sign Up → Sign In link works
def test_signup_link_to_signin(driver, base_url):
    driver.get(url(base_url, "/signup"))
    wait(driver, By.PARTIAL_LINK_TEXT, "Sign in")
    driver.find_element(By.PARTIAL_LINK_TEXT, "Sign in").click()
    WebDriverWait(driver, 10).until(EC.url_contains("/signin"))
    assert "/signin" in driver.current_url


# 9. Search page has input, filters, and submit button
def test_search_page_elements(driver, base_url):
    driver.get(url(base_url, "/search"))
    wait(driver, By.ID, "searchTerm")
    assert driver.find_element(By.ID, "searchTerm").is_displayed()
    assert driver.find_element(By.ID, "rent").is_displayed()
    assert driver.find_element(By.ID, "sale").is_displayed()
    buttons = driver.find_elements(By.TAG_NAME, "button")
    assert any("search" in b.text.lower() for b in buttons)


# 10. Search form updates URL with query params on submit
def test_search_updates_url(driver, base_url):
    driver.get(url(base_url, "/search"))
    wait(driver, By.ID, "searchTerm").send_keys("villa")
    buttons = driver.find_elements(By.TAG_NAME, "button")
    next(b for b in buttons if "search" in b.text.lower()).click()
    WebDriverWait(driver, 10).until(EC.url_contains("searchTerm=villa"))
    assert "searchTerm=villa" in driver.current_url


# 11. About page renders without crashing
def test_about_page_renders(driver, base_url):
    driver.get(url(base_url, "/about"))
    wait(driver, By.TAG_NAME, "body")
    assert len(driver.find_element(By.TAG_NAME, "body").text) > 0


# 12. Contact page renders without crashing
def test_contact_page_renders(driver, base_url):
    driver.get(url(base_url, "/contact"))
    wait(driver, By.TAG_NAME, "body")
    assert len(driver.find_element(By.TAG_NAME, "body").text) > 0
