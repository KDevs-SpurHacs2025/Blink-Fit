export async function loginUser(email, password) {
  try {
    const response = await fetch("https://api-lcq5pbmy4q-pd.a.run.app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Login failed", response.status);
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error during login", error);
    throw error;
  }
}
