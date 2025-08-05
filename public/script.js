async function checkIfStudentExists(email) {
  const res = await fetch(`/api/check-student?email=${encodeURIComponent(email)}`);
  const data = await res.json();
  return data.exists;
}

document.getElementById("registrationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const course = document.getElementById("course").value;

  if (!name || !email || !phone || !dob || !course) {
    alert("Please fill all the fields.");
    return;
  }

  const exists = await checkIfStudentExists(email);
  if (exists) {
    alert(" Student already registered with this email.");
    return;
  }

  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, phone, dob, course }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      document.getElementById("registrationForm").reset();
    })
    .catch((err) => {
      console.error("Error:", err);
      alert(" Registration failed.");
    });
});
