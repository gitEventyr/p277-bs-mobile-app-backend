// Admin Dashboard JavaScript

// Password Toggle Functionality
function togglePassword() {
  const passwordInput = document.getElementById('password');
  const toggleIcon = document.getElementById('toggleIcon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.classList.remove('bi-eye');
    toggleIcon.classList.add('bi-eye-slash');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.remove('bi-eye-slash');
    toggleIcon.classList.add('bi-eye');
  }
}

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const submitBtn = this.querySelector('button[type="submit"]');
      const loginText = submitBtn.querySelector('.login-text');
      const loginSpinner = submitBtn.querySelector('.login-spinner');
      
      // Show loading state
      submitBtn.disabled = true;
      loginText.classList.add('d-none');
      loginSpinner.classList.remove('d-none');
    });
  }
});

// User Search Functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('userSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const search = document.getElementById('search').value;
      const status = document.getElementById('status').value;
      const sortBy = document.getElementById('sortBy').value;
      
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (sortBy) params.append('sortBy', sortBy);
      
      window.location.href = '/admin/users?' + params.toString();
    });
  }
});

// Edit User Form Handler
document.addEventListener('DOMContentLoaded', function() {
  const editUserForm = document.getElementById('editUserForm');
  if (editUserForm) {
    editUserForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      const removeLoadingState = addLoadingState(submitBtn, originalText);
      
      try {
        const formData = new FormData(this);
        const userId = formData.get('userId');
        
        // Convert form data to object (excluding userId)
        const userData = {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          device: formData.get('device'),
          os: formData.get('os')
        };
        
        const response = await fetch(`/admin/api/users/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Close modal and refresh page
          bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
          showToast('User updated successfully!', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showToast(result.message || 'Error updating user', 'danger');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        showToast('Network error. Please try again.', 'danger');
      } finally {
        removeLoadingState();
      }
    });
  }
});

// Adjust Balance Form Handler
document.addEventListener('DOMContentLoaded', function() {
  const adjustBalanceForm = document.getElementById('adjustBalanceForm');
  if (adjustBalanceForm) {
    adjustBalanceForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      const removeLoadingState = addLoadingState(submitBtn, originalText);
      
      try {
        const formData = new FormData(this);
        const userId = formData.get('userId');
        const amount = parseInt(formData.get('amount'));
        const reason = formData.get('reason');
        const customReason = formData.get('customReason');
        
        const finalReason = reason === 'other' && customReason ? customReason : reason;
        
        const response = await fetch(`/admin/api/users/${userId}/adjust-balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            reason: finalReason
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Close modal and refresh page
          bootstrap.Modal.getInstance(document.getElementById('adjustBalanceModal')).hide();
          showToast(result.message, 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showToast(result.message || 'Error adjusting balance', 'danger');
        }
      } catch (error) {
        console.error('Error adjusting balance:', error);
        showToast('Network error. Please try again.', 'danger');
      } finally {
        removeLoadingState();
      }
    });
  }
});

// Reason dropdown handler
document.addEventListener('DOMContentLoaded', function() {
  const reasonSelect = document.getElementById('adjustReason');
  const customReasonGroup = document.getElementById('customReasonGroup');
  
  if (reasonSelect && customReasonGroup) {
    reasonSelect.addEventListener('change', function() {
      if (this.value === 'other') {
        customReasonGroup.style.display = 'block';
        document.getElementById('customReason').required = true;
      } else {
        customReasonGroup.style.display = 'none';
        document.getElementById('customReason').required = false;
        document.getElementById('customReason').value = '';
      }
    });
  }
});

// Clear Search Function
function clearSearch() {
  document.getElementById('search').value = '';
  document.getElementById('status').value = '';
  document.getElementById('sortBy').value = 'created_at';
  window.location.href = '/admin/users';
}

// Show Create User Modal
function showCreateUserModal() {
  const modal = new bootstrap.Modal(document.getElementById('createUserModal'));
  modal.show();
}

// Create User Form Handler
document.addEventListener('DOMContentLoaded', function() {
  const createUserForm = document.getElementById('createUserForm');
  if (createUserForm) {
    createUserForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      const removeLoadingState = addLoadingState(submitBtn, originalText);
      
      try {
        const formData = new FormData(this);
        const userData = Object.fromEntries(formData.entries());
        
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Close modal and refresh page
          bootstrap.Modal.getInstance(document.getElementById('createUserModal')).hide();
          showToast('User created successfully!', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showToast(result.message || 'Error creating user', 'error');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        showToast('Network error. Please try again.', 'error');
      } finally {
        removeLoadingState();
      }
    });
  }
});

// Refresh Users Function
function refreshUsers() {
  window.location.reload();
}

// View User Details Modal
async function viewUser(userId) {
  const modal = new bootstrap.Modal(document.getElementById('userModal'));
  const modalBody = document.getElementById('userModalBody');
  const editBtn = document.getElementById('editUserBtn');
  
  // Show loading state
  modalBody.innerHTML = `
    <div class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading user details...</p>
    </div>
  `;
  
  modal.show();
  
  try {
    const response = await fetch(`/admin/api/users/${userId}`);
    const result = await response.json();
    
    if (result.success) {
      const user = result.data;
      modalBody.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <h6 class="fw-bold">Basic Information</h6>
            <table class="table table-sm">
              <tr><td><strong>Name:</strong></td><td>${user.name || 'N/A'}</td></tr>
              <tr><td><strong>Email:</strong></td><td>${user.email || 'N/A'}</td></tr>
              <tr><td><strong>Phone:</strong></td><td>${user.phone || 'N/A'}</td></tr>
              <tr><td><strong>Visitor ID:</strong></td><td>${user.visitor_id || 'N/A'}</td></tr>
              <tr><td><strong>Balance:</strong></td><td><span class="badge bg-success">${user.coins_balance || 0} coins</span></td></tr>
              <tr><td><strong>Level:</strong></td><td>${user.level || 1}</td></tr>
              <tr><td><strong>Scratch Cards:</strong></td><td>${user.scratch_cards || 0}</td></tr>
            </table>
          </div>
          <div class="col-md-6">
            <h6 class="fw-bold">Device Information</h6>
            <table class="table table-sm">
              <tr><td><strong>Device UDID:</strong></td><td>${user.device_udid || 'N/A'}</td></tr>
              <tr><td><strong>OS:</strong></td><td>${user.os || 'N/A'}</td></tr>
              <tr><td><strong>Device:</strong></td><td>${user.device || 'N/A'}</td></tr>
              <tr><td><strong>Registered:</strong></td><td>${formatDate(user.created_at)}</td></tr>
              <tr><td><strong>Last Updated:</strong></td><td>${formatDate(user.updated_at)}</td></tr>
            </table>
          </div>
        </div>
        
        ${user.pid ? `
        <div class="row mt-4">
          <div class="col-12">
            <h6 class="fw-bold">AppsFlyer Attribution</h6>
            <table class="table table-sm">
              <tr><td><strong>PID:</strong></td><td>${user.pid || 'N/A'}</td></tr>
              <tr><td><strong>Campaign:</strong></td><td>${user.c || 'N/A'}</td></tr>
              <tr><td><strong>Channel:</strong></td><td>${user.af_channel || 'N/A'}</td></tr>
              <tr><td><strong>Ad Set:</strong></td><td>${user.af_adset || 'N/A'}</td></tr>
              <tr><td><strong>Ad:</strong></td><td>${user.af_ad || 'N/A'}</td></tr>
              <tr><td><strong>Keywords:</strong></td><td>${user.af_keywords || 'N/A'}</td></tr>
            </table>
          </div>
        </div>
        ` : ''}
      `;
      
      editBtn.onclick = () => editUser(userId);
    } else {
      modalBody.innerHTML = `
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          Error loading user details: ${result.message}
        </div>
      `;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    modalBody.innerHTML = `
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-triangle"></i>
        Error loading user details. Please try again.
      </div>
    `;
  }
}

// Edit User Function
async function editUser(userId) {
  try {
    // First get user details
    const response = await fetch(`/admin/api/users/${userId}`);
    const result = await response.json();
    
    if (result.success) {
      const user = result.data;
      
      // Populate edit form
      document.getElementById('editUserId').value = userId;
      document.getElementById('editUserName').value = user.name || '';
      document.getElementById('editUserEmail').value = user.email || '';
      document.getElementById('editUserPhone').value = user.phone || '';
      document.getElementById('editUserDevice').value = user.device || '';
      document.getElementById('editUserOS').value = user.os || '';
      
      // Close user details modal if open
      const userModal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
      if (userModal) {
        userModal.hide();
      }
      
      // Show edit modal
      const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
      editModal.show();
    } else {
      showToast('Error loading user details: ' + result.message, 'danger');
    }
  } catch (error) {
    console.error('Error loading user for edit:', error);
    showToast('Error loading user details', 'danger');
  }
}

// Adjust Balance Function
async function adjustBalance(userId) {
  try {
    // First get user details
    const response = await fetch(`/admin/api/users/${userId}`);
    const result = await response.json();
    
    if (result.success) {
      const user = result.data;
      
      // Populate adjustment form
      document.getElementById('adjustUserId').value = userId;
      document.getElementById('adjustUserName').textContent = user.name || 'N/A';
      document.getElementById('adjustCurrentBalance').textContent = `${user.coins_balance || 0} coins`;
      
      // Reset form fields
      document.getElementById('adjustAmount').value = '';
      document.getElementById('adjustReason').value = '';
      document.getElementById('customReason').value = '';
      document.getElementById('customReasonGroup').style.display = 'none';
      document.getElementById('customReason').required = false;
      
      // Show adjustment modal
      const adjustModal = new bootstrap.Modal(document.getElementById('adjustBalanceModal'));
      adjustModal.show();
    } else {
      showToast('Error loading user details: ' + result.message, 'danger');
    }
  } catch (error) {
    console.error('Error loading user for balance adjustment:', error);
    showToast('Error loading user details', 'danger');
  }
}

// Date Formatting Helper
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Auto-hide flash messages
document.addEventListener('DOMContentLoaded', function() {
  const alerts = document.querySelectorAll('.alert-dismissible');
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000); // Auto-hide after 5 seconds
  });
});

// Form Validation Helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Add loading state to buttons
function addLoadingState(button, originalText) {
  button.disabled = true;
  button.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2" role="status">
      <span class="visually-hidden">Loading...</span>
    </span>
    Loading...
  `;
  
  return function removeLoadingState() {
    button.disabled = false;
    button.innerHTML = originalText;
  };
}

// Confirm Dialog Helper
function confirmAction(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

// Toast Notification Helper
function showToast(message, type = 'info') {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toastId = 'toast-' + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <i class="bi bi-info-circle text-${type} me-2"></i>
        <strong class="me-auto">Notification</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;
  
  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  
  // Show toast
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
  
  // Remove toast element after it's hidden
  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Export functions for global access
window.AdminDashboard = {
  togglePassword,
  clearSearch,
  refreshUsers,
  viewUser,
  editUser,
  adjustBalance,
  formatDate,
  addLoadingState,
  confirmAction,
  showToast
};