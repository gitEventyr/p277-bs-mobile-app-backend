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
      const sortBy = document.getElementById('sortBy').value;
      const emailVerified = document.getElementById('emailVerified').value;
      const phoneVerified = document.getElementById('phoneVerified').value;

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (sortBy) params.append('sortBy', sortBy);
      if (emailVerified) params.append('email_verified', emailVerified);
      if (phoneVerified) params.append('phone_verified', phoneVerified);

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
          os: formData.get('os'),
          level: parseInt(formData.get('level')) || 1,
          scratch_cards: parseInt(formData.get('scratch_cards')) || 0
        };
        
        const response = await fetch(`/admin/api/users/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify(userData)
        });
        
        if (response.ok) {
          const result = await response.json();
          // Close modal and refresh page
          bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
          showToast('User updated successfully!', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          const errorResult = await response.json();
          showToast(errorResult.message || 'Error updating user', 'danger');
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
          credentials: 'same-origin',
          body: JSON.stringify({
            amount: amount,
            reason: finalReason
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          // Close modal and refresh page
          bootstrap.Modal.getInstance(document.getElementById('adjustBalanceModal')).hide();
          const amount = parseInt(document.getElementById('adjustAmount').value);
          showToast(`Balance ${amount > 0 ? 'increased' : 'decreased'} successfully`, 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          const errorResult = await response.json();
          showToast(errorResult.message || 'Error adjusting balance', 'danger');
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

// Adjust RP Balance Form Handler
document.addEventListener('DOMContentLoaded', function() {
  const adjustRpBalanceForm = document.getElementById('adjustRpBalanceForm');
  if (adjustRpBalanceForm) {
    adjustRpBalanceForm.addEventListener('submit', async function(e) {
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
        
        const response = await fetch(`/admin/api/users/${userId}/adjust-rp-balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            amount: amount,
            reason: finalReason
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          // Close modal and refresh page
          bootstrap.Modal.getInstance(document.getElementById('adjustRpBalanceModal')).hide();
          const amount = parseInt(document.getElementById('adjustRpAmount').value);
          showToast(`RP Balance ${amount > 0 ? 'increased' : 'decreased'} successfully`, 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          const errorResult = await response.json();
          showToast(errorResult.message || 'Error adjusting RP balance', 'danger');
        }
      } catch (error) {
        console.error('Error adjusting RP balance:', error);
        showToast('Network error. Please try again.', 'danger');
      } finally {
        removeLoadingState();
      }
    });
  }
});

// RP Reason dropdown handler
document.addEventListener('DOMContentLoaded', function() {
  const rpReasonSelect = document.getElementById('adjustRpReason');
  const customRpReasonGroup = document.getElementById('customRpReasonGroup');
  
  if (rpReasonSelect && customRpReasonGroup) {
    rpReasonSelect.addEventListener('change', function() {
      if (this.value === 'other') {
        customRpReasonGroup.style.display = 'block';
        document.getElementById('customRpReason').required = true;
      } else {
        customRpReasonGroup.style.display = 'none';
        document.getElementById('customRpReason').required = false;
        document.getElementById('customRpReason').value = '';
      }
    });
  }
});

// Clear Search Function - removed as each page has its own implementation

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
        
        const response = await fetch('/admin/api/users', {
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
          // Handle validation errors properly
          let errorMessage = result.message || 'Error creating user';
          if (result.message && result.message.details && Array.isArray(result.message.details)) {
            errorMessage = result.message.details.join(', ');
          } else if (typeof result.message === 'object' && result.message.details) {
            errorMessage = result.message.details.join(', ');
          }
          showToast(errorMessage, 'danger');
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
    const response = await fetch(`/admin/api/users/${userId}`, {
      credentials: 'same-origin'
    });
    
    if (response.ok) {
      const result = await response.json();
      
      // Debug: Log the raw response to see what we're getting
      console.log('Raw API response for viewUser:', response.status, result);
      
      // Handle the response based on structure
      const user = result.success ? result.data : result;
      
      // Debug: Log the user data to see what we're actually getting
      console.log('User data received:', user);
      console.log('Name field:', user.name, typeof user.name);
      console.log('Email field:', user.email, typeof user.email);
      console.log('Phone field:', user.phone, typeof user.phone);
      
      modalBody.innerHTML = `
        <div class="row">
          <div class="col-md-6 mb-3">
            <h6 class="fw-bold">Basic Information</h6>
            <table class="table table-sm table-responsive-sm">
              <tbody>
                <tr><td style="width: 40%;"><strong>Name:</strong></td><td style="word-break: break-word;">${user.name && user.name.trim() !== '' ? user.name : 'N/A'}</td></tr>
                <tr><td><strong>Email:</strong></td><td style="word-break: break-word;">${user.email && user.email.trim() !== '' ? user.email : 'N/A'}</td></tr>
                <tr><td><strong>Phone:</strong></td><td style="word-break: break-word;">${user.phone && user.phone.trim() !== '' ? user.phone : 'N/A'}</td></tr>
                <tr><td><strong>Visitor ID:</strong></td><td style="word-break: break-all; font-size: 0.85rem;">${user.visitor_id && user.visitor_id.trim() !== '' ? user.visitor_id : 'N/A'}</td></tr>
                <tr><td><strong>Coin Balance:</strong></td><td><span class="badge bg-success">${user.coins_balance !== undefined && user.coins_balance !== null ? user.coins_balance : 0} coins</span></td></tr>
                <tr><td><strong>RP Balance:</strong></td><td><span class="badge bg-info">${user.rp_balance !== undefined && user.rp_balance !== null ? user.rp_balance : 0} RP</span></td></tr>
                <tr><td><strong>Level:</strong></td><td>${user.level !== undefined && user.level !== null ? user.level : 1}</td></tr>
                <tr><td><strong>Scratch Cards:</strong></td><td>${user.scratch_cards !== undefined && user.scratch_cards !== null ? user.scratch_cards : 0}</td></tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-6 mb-3">
            <h6 class="fw-bold">Device Information</h6>
            <table class="table table-sm table-responsive-sm">
              <tbody>
                <tr><td style="width: 40%;"><strong>Device UDID:</strong></td><td style="word-break: break-all; font-size: 0.85rem;">${user.device_udid && user.device_udid.trim() !== '' ? user.device_udid : 'N/A'}</td></tr>
                <tr><td><strong>OS:</strong></td><td style="word-break: break-word;">${user.os && user.os.trim() !== '' ? user.os : 'N/A'}</td></tr>
                <tr><td><strong>Device:</strong></td><td style="word-break: break-word;">${user.device && user.device.trim() !== '' ? user.device : 'N/A'}</td></tr>
                <tr><td><strong>Registered:</strong></td><td style="word-break: break-word;">${formatDate(user.created_at)}</td></tr>
                <tr><td><strong>Last Updated:</strong></td><td style="word-break: break-word;">${formatDate(user.updated_at)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        ${user.pid ? `
        <div class="row mt-2">
          <div class="col-12">
            <h6 class="fw-bold">AppsFlyer Attribution</h6>
            <table class="table table-sm table-responsive-sm">
              <tbody>
                <tr><td style="width: 20%;"><strong>PID:</strong></td><td style="word-break: break-word;">${user.pid || 'N/A'}</td></tr>
                <tr><td><strong>Campaign:</strong></td><td style="word-break: break-word;">${user.c || 'N/A'}</td></tr>
                <tr><td><strong>Channel:</strong></td><td style="word-break: break-word;">${user.af_channel || 'N/A'}</td></tr>
                <tr><td><strong>Ad Set:</strong></td><td style="word-break: break-word;">${user.af_adset || 'N/A'}</td></tr>
                <tr><td><strong>Ad:</strong></td><td style="word-break: break-word;">${user.af_ad || 'N/A'}</td></tr>
                <tr><td><strong>Keywords:</strong></td><td style="word-break: break-word;">${user.af_keywords || 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}
      `;
      
      editBtn.onclick = () => editUser(userId);
    } else {
      const errorResult = await response.json();
      console.error('API returned error:', response.status, errorResult);
      modalBody.innerHTML = `
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          Error loading user details: ${errorResult.message || 'Unknown error'}
        </div>
      `;
      
      // If authentication failed, reload the page
      if (response.status === 401) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
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
    const response = await fetch(`/admin/api/users/${userId}`, {
      credentials: 'same-origin'
    });
    
    if (response.ok) {
      const result = await response.json();
      
      // Handle the response based on structure
      const user = result.success ? result.data : result;
      
      // Debug: Log the user data for edit form
      console.log('Edit form user data:', user);
      console.log('Edit form name:', user.name, typeof user.name);
      
      // Populate edit form
      document.getElementById('editUserId').value = userId;
      document.getElementById('editUserName').value = user.name || '';
      document.getElementById('editUserEmail').value = user.email || '';
      document.getElementById('editUserPhone').value = user.phone || '';
      document.getElementById('editUserDevice').value = user.device || '';
      document.getElementById('editUserOS').value = user.os || '';
      document.getElementById('editUserLevel').value = user.level || 1;
      document.getElementById('editUserScratchCards').value = user.scratch_cards || 0;
      
      // Close user details modal if open
      const userModal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
      if (userModal) {
        userModal.hide();
      }
      
      // Show edit modal
      const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
      editModal.show();
    } else {
      const errorResult = await response.json();
      console.error('Edit user API error:', response.status, errorResult);
      showToast('Error loading user details: ' + (errorResult.message || 'Unknown error'), 'danger');
      
      // If authentication failed, reload the page
      if (response.status === 401) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  } catch (error) {
    console.error('Error loading user for edit:', error);
    showToast('Error loading user details', 'danger');
  }
}

// Adjust RP Balance Function
async function adjustRpBalance(userId) {
  try {
    // First get user details
    const response = await fetch(`/admin/api/users/${userId}`, {
      credentials: 'same-origin'
    });
    
    if (response.ok) {
      const result = await response.json();
      
      // Handle the response based on structure
      const user = result.success ? result.data : result;
      
      // Debug: Log the user data for RP balance adjustment
      console.log('RP Balance adjustment user data:', user);
      console.log('RP Balance adjustment name:', user.name, typeof user.name);
      console.log('RP Balance adjustment balance:', user.rp_balance, typeof user.rp_balance);
      
      // Populate adjustment form
      document.getElementById('adjustRpUserId').value = userId;
      document.getElementById('adjustRpUserName').textContent = user.name || 'N/A';
      document.getElementById('adjustRpCurrentBalance').textContent = `${user.rp_balance !== undefined && user.rp_balance !== null ? user.rp_balance : 0} RP`;
      
      // Reset form fields
      document.getElementById('adjustRpAmount').value = '';
      document.getElementById('adjustRpReason').value = '';
      document.getElementById('customRpReason').value = '';
      document.getElementById('customRpReasonGroup').style.display = 'none';
      document.getElementById('customRpReason').required = false;
      
      // Show adjustment modal
      const adjustModal = new bootstrap.Modal(document.getElementById('adjustRpBalanceModal'));
      adjustModal.show();
    } else {
      const errorResult = await response.json();
      console.error('Adjust RP balance API error:', response.status, errorResult);
      showToast('Error loading user details: ' + (errorResult.message || 'Unknown error'), 'danger');
      
      // If authentication failed, reload the page
      if (response.status === 401) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  } catch (error) {
    console.error('Error loading user for RP balance adjustment:', error);
    showToast('Error loading user details', 'danger');
  }
}

// Adjust Balance Function
async function adjustBalance(userId) {
  try {
    // First get user details
    const response = await fetch(`/admin/api/users/${userId}`, {
      credentials: 'same-origin'
    });
    
    if (response.ok) {
      const result = await response.json();
      
      // Handle the response based on structure
      const user = result.success ? result.data : result;
      
      // Debug: Log the user data for balance adjustment
      console.log('Balance adjustment user data:', user);
      console.log('Balance adjustment name:', user.name, typeof user.name);
      console.log('Balance adjustment balance:', user.coins_balance, typeof user.coins_balance);
      
      // Populate adjustment form
      document.getElementById('adjustUserId').value = userId;
      document.getElementById('adjustUserName').textContent = user.name || 'N/A';
      document.getElementById('adjustCurrentBalance').textContent = `${user.coins_balance !== undefined && user.coins_balance !== null ? user.coins_balance : 0} coins`;
      
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
      const errorResult = await response.json();
      console.error('Adjust balance API error:', response.status, errorResult);
      showToast('Error loading user details: ' + (errorResult.message || 'Unknown error'), 'danger');
      
      // If authentication failed, reload the page
      if (response.status === 401) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
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
  adjustRpBalance,
  formatDate,
  addLoadingState,
  confirmAction,
  showToast
};