"""
Test script for TaskFlow 3D API

This script performs basic tests on the API endpoints.
Make sure the server is running before executing this script.
"""

import requests
import json
from typing import Optional

# Configuration
BASE_URL = "http://localhost:8000"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "testpassword123"
TEST_NAME = "Test User"


class APITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.token: Optional[str] = None
        self.user_id: Optional[str] = None
        self.todo_id: Optional[str] = None

    def print_result(self, test_name: str, success: bool, response: Optional[requests.Response] = None):
        """Print test result with formatting."""
        status = "[PASS]" if success else "[FAIL]"
        print(f"{status} - {test_name}")
        if response and not success:
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
        print()

    def test_health(self):
        """Test health check endpoint."""
        try:
            response = requests.get(f"{self.base_url}/health")
            success = response.status_code == 200 and response.json().get("status") == "healthy"
            self.print_result("Health Check", success, response)
            return success
        except Exception as e:
            print(f"[FAIL] - Health Check: {e}\n")
            return False

    def test_signup(self):
        """Test user signup."""
        try:
            data = {
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD,
                "name": TEST_NAME
            }
            response = requests.post(f"{self.base_url}/api/auth/signup", json=data)

            if response.status_code == 201:
                result = response.json()
                self.token = result.get("access_token")
                self.user_id = result.get("user", {}).get("id")
                success = self.token is not None and self.user_id is not None
            elif response.status_code == 400 and "already registered" in response.text:
                # User already exists, try signin instead
                print("ℹ️  User already exists, will test signin instead")
                return self.test_signin()
            else:
                success = False

            self.print_result("User Signup", success, response)
            return success
        except Exception as e:
            print(f"[FAIL] FAIL - User Signup: {e}\n")
            return False

    def test_signin(self):
        """Test user signin."""
        try:
            data = {
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD
            }
            response = requests.post(f"{self.base_url}/api/auth/signin", json=data)
            success = response.status_code == 200

            if success:
                result = response.json()
                self.token = result.get("access_token")
                self.user_id = result.get("user", {}).get("id")

            self.print_result("User Signin", success, response)
            return success
        except Exception as e:
            print(f"[FAIL] FAIL - User Signin: {e}\n")
            return False

    def test_get_me(self):
        """Test getting current user info."""
        if not self.token:
            print("⚠️  SKIP - Get Current User: No token available\n")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{self.base_url}/api/auth/me", headers=headers)
            success = response.status_code == 200
            self.print_result("Get Current User", success, response)
            return success
        except Exception as e:
            print(f"[FAIL] FAIL - Get Current User: {e}\n")
            return False

    def test_create_todo(self):
        """Test creating a new todo."""
        if not self.token:
            print("⚠️  SKIP - Create Todo: No token available\n")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            data = {
                "title": "Test Todo from API Test",
                "description": "This todo was created by the test script",
                "priority": "high",
                "category": "work",
                "status": "pending"
            }
            response = requests.post(f"{self.base_url}/api/todos", json=data, headers=headers)
            success = response.status_code == 201

            if success:
                result = response.json()
                self.todo_id = result.get("id")

            self.print_result("Create Todo", success, response)
            return success
        except Exception as e:
            print(f"[FAIL] FAIL - Create Todo: {e}\n")
            return False

    def test_get_todos(self):
        """Test getting all todos."""
        if not self.token:
            print("⚠️  SKIP - Get Todos: No token available\n")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{self.base_url}/api/todos", headers=headers)
            success = response.status_code == 200

            if success:
                todos = response.json()
                print(f"   Found {len(todos)} todo(s)")

            self.print_result("Get Todos", success, response)
            return success
        except Exception as e:
            print(f"[FAIL] FAIL - Get Todos: {e}\n")
            return False

    def test_update_todo(self):
        """Test updating a todo."""
        if not self.token or not self.todo_id:
            print("⚠️  SKIP - Update Todo: No token or todo_id available\n")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            data = {
                "title": "Updated Test Todo",
                "status": "in-progress"
            }
            response = requests.put(
                f"{self.base_url}/api/todos/{self.todo_id}",
                json=data,
                headers=headers
            )
            success = response.status_code == 200
            self.print_result("Update Todo", success, response)
            return success
        except Exception as e:
            print(f"[FAIL] FAIL - Update Todo: {e}\n")
            return False

    def test_toggle_todo(self):
        """Test toggling todo completion."""
        if not self.token or not self.todo_id:
            print("⚠️  SKIP - Toggle Todo: No token or todo_id available\n")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            data = {"completed": True}
            response = requests.patch(
                f"{self.base_url}/api/todos/{self.todo_id}/toggle",
                json=data,
                headers=headers
            )
            success = response.status_code == 200
            self.print_result("Toggle Todo Completion", success, response)
            return success
        except Exception as e:
            print(f"[FAIL] FAIL - Toggle Todo: {e}\n")
            return False

    def test_delete_todo(self):
        """Test deleting a todo."""
        if not self.token or not self.todo_id:
            print("⚠️  SKIP - Delete Todo: No token or todo_id available\n")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.delete(
                f"{self.base_url}/api/todos/{self.todo_id}",
                headers=headers
            )
            success = response.status_code == 204
            self.print_result("Delete Todo", success, response)
            return success
        except Exception as e:
            print(f"[FAIL] FAIL - Delete Todo: {e}\n")
            return False

    def run_all_tests(self):
        """Run all tests in sequence."""
        print("=" * 60)
        print("TaskFlow 3D API - Test Suite")
        print("=" * 60)
        print(f"Testing API at: {self.base_url}")
        print("=" * 60)
        print()

        tests = [
            ("Health Check", self.test_health),
            ("User Signup", self.test_signup),
            ("Get Current User", self.test_get_me),
            ("Create Todo", self.test_create_todo),
            ("Get Todos", self.test_get_todos),
            ("Update Todo", self.test_update_todo),
            ("Toggle Todo", self.test_toggle_todo),
            ("Delete Todo", self.test_delete_todo),
        ]

        results = []
        for test_name, test_func in tests:
            results.append(test_func())

        print("=" * 60)
        print("Test Summary")
        print("=" * 60)
        passed = sum(results)
        total = len(results)
        print(f"Passed: {passed}/{total}")
        print(f"Failed: {total - passed}/{total}")
        print("=" * 60)

        return passed == total


def main():
    """Main test runner."""
    print("\nMake sure the API server is running at http://localhost:8000\n")

    try:
        tester = APITester(BASE_URL)
        success = tester.run_all_tests()

        if success:
            print("\n[PASS] All tests passed!")
            exit(0)
        else:
            print("\n[FAIL] Some tests failed. Check the output above.")
            exit(1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n[FAIL] Unexpected error: {e}")
        exit(1)


if __name__ == "__main__":
    main()
