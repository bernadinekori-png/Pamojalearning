const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

document.getElementById('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('category', document.getElementById('category').value);
  const attachment = document.getElementById('attachment').files[0];
  if (attachment) formData.append('attachment', attachment);

  const res = await fetch(`${CONFIG.BASE_URL}/reports`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  const data = await res.json();
  alert(res.ok ? 'Report submitted!' : data.message);
});

// Demo Chart
const ctx = document.getElementById('statusChart');
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [{
      data: [10, 5, 3],
      backgroundColor: ['#ffc107', '#28a745', '#dc3545']
    }]
  }
});
