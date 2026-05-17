async function run() {
  try {
    const res = await fetch('http://localhost:5003/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'test1234567@gmail.com', password: 'password123' })
    });
    console.log('Status:', res.status);
    console.log('Body:', await res.text());
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}
run();
