export async function startTaskTimer(taskId: number, note?: string) {
  const token = localStorage.getItem('token') || '';
  return fetch(`/api/tasks/${taskId}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ note: note || null }),
  });
}

export async function pauseTaskTimer(taskId: number, note?: string) {
  const token = localStorage.getItem('token') || '';
  return fetch(`/api/tasks/${taskId}/pause`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ note: note || null }),
  });
}

export async function resumeTaskTimer(taskId: number, note?: string) {
  const token = localStorage.getItem('token') || '';
  return fetch(`/api/tasks/${taskId}/resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ note: note || null }),
  });
}

export async function stopTaskTimer(taskId: number, note?: string) {
  const token = localStorage.getItem('token') || '';
  return fetch(`/api/tasks/${taskId}/stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ note: note || null }),
  });
}

export async function getTaskLogs(taskId: number) {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`/api/tasks/${taskId}/logs`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch task logs');
  }
  return res.json();
}
