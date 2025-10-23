// Admin Dashboard JavaScript

// Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mainContent = document.querySelector('main');

  if (sidebar && sidebarToggle && mainContent) {
    // Initialize tooltips for sidebar links
    const sidebarLinks = sidebar.querySelectorAll('.nav-link');
    let tooltips = [];

    function initTooltips() {
      // Dispose existing tooltips
      tooltips.forEach(tooltip => tooltip.dispose());
      tooltips = [];

      // Create new tooltips only if sidebar is minimized
      const isMinimized = sidebar.classList.contains('minimized');
      if (isMinimized) {
        sidebarLinks.forEach(link => {
          const tooltip = new bootstrap.Tooltip(link, {
            trigger: 'hover',
            container: 'body'
          });
          tooltips.push(tooltip);
        });
      }
    }

    // Check if sidebar state is stored in localStorage
    const isSidebarMinimized = localStorage.getItem('sidebarMinimized') === 'true';

    if (isSidebarMinimized) {
      sidebar.classList.add('minimized');
      mainContent.classList.add('sidebar-minimized');
    }

    // Initialize tooltips based on initial state
    initTooltips();

    // Toggle sidebar on button click
    sidebarToggle.addEventListener('click', function() {
      const isMinimized = sidebar.classList.toggle('minimized');
      mainContent.classList.toggle('sidebar-minimized');

      // Persist state to localStorage
      localStorage.setItem('sidebarMinimized', isMinimized);

      // Reinitialize tooltips
      initTooltips();
    });
  }
});

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

// User Search Functionality with AJAX table reload
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('userSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', async function(e) {
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

      // Add loading overlay
      const tableCard = document.querySelector('.card:has(table)');
      if (tableCard) {
        tableCard.style.position = 'relative';
        const overlay = document.createElement('div');
        overlay.id = 'table-loading-overlay';
        overlay.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;';
        overlay.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
        tableCard.appendChild(overlay);
      }

      // Fetch the page with new parameters
      try {
        const response = await fetch('/admin/users?' + params.toString(), {
          credentials: 'same-origin'
        });

        if (response.ok) {
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          // Extract and replace only the table card
          const newTableCard = doc.querySelector('.card:has(table)');
          const oldTableCard = document.querySelector('.card:has(table)');

          if (newTableCard && oldTableCard) {
            oldTableCard.innerHTML = newTableCard.innerHTML;
          }

          // Update URL without reload
          window.history.pushState({}, '', '/admin/users?' + params.toString());
        } else {
          // Fallback to full page reload
          window.location.href = '/admin/users?' + params.toString();
        }
      } catch (error) {
        console.error('Error reloading table:', error);
        // Fallback to full page reload
        window.location.href = '/admin/users?' + params.toString();
      } finally {
        // Remove loading overlay
        const overlay = document.getElementById('table-loading-overlay');
        if (overlay) overlay.remove();
      }
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

// Unified Balance Type Selector Handler
document.addEventListener('DOMContentLoaded', function() {
  const balanceTypeSelect = document.getElementById('adjustBalanceType');
  const amountUnit = document.getElementById('adjustAmountUnit');

  if (balanceTypeSelect && amountUnit) {
    balanceTypeSelect.addEventListener('change', function() {
      if (this.value === 'coins') {
        amountUnit.textContent = 'coins';
      } else if (this.value === 'rp') {
        amountUnit.textContent = 'RP';
      } else {
        amountUnit.textContent = 'coins/RP';
      }
    });
  }
});

// Unified Adjust Balance Form Handler
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
        const balanceType = formData.get('balanceType');
        const amount = parseInt(formData.get('amount'));
        const reason = formData.get('reason');
        const customReason = formData.get('customReason');

        const finalReason = reason === 'other' && customReason ? customReason : reason;

        // Determine endpoint based on balance type
        const endpoint = balanceType === 'coins'
          ? `/admin/api/users/${userId}/adjust-balance`
          : `/admin/api/users/${userId}/adjust-rp-balance`;

        const response = await fetch(endpoint, {
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
          const balanceName = balanceType === 'coins' ? 'Coins balance' : 'RP balance';
          showToast(`${balanceName} ${amount > 0 ? 'increased' : 'decreased'} successfully`, 'success');
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
      
      // Build location string
      const locationStr = user.location && (user.location.city || user.location.country)
        ? `${user.location.city || ''}${user.location.city && user.location.country ? ', ' : ''}${user.location.country || ''}`
        : 'N/A';

      // Build purchase history table
      const purchaseHistoryHTML = user.purchases && user.purchases.recent && user.purchases.recent.length > 0
        ? `
          <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
            <table class="table table-sm table-striped">
              <thead class="sticky-top bg-light">
                <tr>
                  <th style="font-size: 0.85rem;">Date</th>
                  <th style="font-size: 0.85rem;">Product</th>
                  <th style="font-size: 0.85rem;">Amount</th>
                  <th style="font-size: 0.85rem;">Platform</th>
                </tr>
              </thead>
              <tbody>
                ${user.purchases.recent.map(p => `
                  <tr>
                    <td style="font-size: 0.8rem;">${formatDate(p.purchased_at)}</td>
                    <td style="font-size: 0.8rem;">${p.product_id}</td>
                    <td style="font-size: 0.8rem;">${p.currency} ${p.amount.toFixed(2)}</td>
                    <td style="font-size: 0.8rem;"><span class="badge bg-${p.platform === 'ios' ? 'secondary' : 'success'}">${p.platform}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="mt-2">
            <small class="text-muted">
              Total: ${user.purchases.total_count} purchase${user.purchases.total_count !== 1 ? 's' : ''} |
              Total Spent: $${user.purchases.total_spent.toFixed(2)}
            </small>
          </div>
        `
        : '<p class="text-muted">No purchase history</p>';

      modalBody.innerHTML = `
        <div class="row">
          <!-- Left Column: User Information -->
          <div class="col-md-6">
            <h6 class="fw-bold mb-3">Basic Information</h6>
            <table class="table table-sm table-responsive-sm mb-4">
              <tbody>
                <tr><td style="width: 40%;"><strong>User ID:</strong></td><td style="word-break: break-word;">${user.id || 'N/A'}</td></tr>
                <tr><td><strong>Name:</strong></td><td style="word-break: break-word;">${user.name && user.name.trim() !== '' ? user.name : 'N/A'}</td></tr>
                <tr><td><strong>Email:</strong></td><td style="word-break: break-word;">${user.email && user.email.trim() !== '' ? user.email : 'N/A'}</td></tr>
                <tr><td><strong>Phone:</strong></td><td style="word-break: break-word;">${user.phone && user.phone.trim() !== '' ? user.phone : 'N/A'}</td></tr>
                <tr><td><strong>Visitor ID:</strong></td><td style="word-break: break-all; font-size: 0.85rem;">${user.visitor_id && user.visitor_id.trim() !== '' ? user.visitor_id : 'N/A'}</td></tr>
                <tr><td><strong>IP Address:</strong></td><td style="word-break: break-word;">${user.ip_address || 'N/A'}</td></tr>
                <tr><td><strong>Location:</strong></td><td style="word-break: break-word;">${locationStr}</td></tr>
              </tbody>
            </table>

            <h6 class="fw-bold mb-3">Balance & Progress</h6>
            <table class="table table-sm table-responsive-sm mb-4">
              <tbody>
                <tr><td style="width: 40%;"><strong>Coin Balance:</strong></td><td><span class="badge bg-success">${user.coins_balance !== undefined && user.coins_balance !== null ? user.coins_balance : 0} coins</span></td></tr>
                <tr><td><strong>RP Balance:</strong></td><td><span class="badge bg-info">${user.rp_balance !== undefined && user.rp_balance !== null ? user.rp_balance : 0} RP</span></td></tr>
                <tr><td><strong>Level:</strong></td><td>${user.level !== undefined && user.level !== null ? user.level : 1}</td></tr>
                <tr><td><strong>Scratch Cards:</strong></td><td>${user.scratch_cards !== undefined && user.scratch_cards !== null ? user.scratch_cards : 0}</td></tr>
              </tbody>
            </table>

            <h6 class="fw-bold mb-3">Device Information</h6>
            <table class="table table-sm table-responsive-sm mb-4">
              <tbody>
                <tr><td style="width: 40%;"><strong>Device UDID:</strong></td><td style="word-break: break-all; font-size: 0.85rem;">${user.device_udid && user.device_udid.trim() !== '' ? user.device_udid : 'N/A'}</td></tr>
                <tr><td><strong>OS:</strong></td><td style="word-break: break-word;">${user.os && user.os.trim() !== '' ? user.os : 'N/A'}</td></tr>
                <tr><td><strong>Device:</strong></td><td style="word-break: break-word;">${user.device && user.device.trim() !== '' ? user.device : 'N/A'}</td></tr>
                <tr><td><strong>Registered:</strong></td><td style="word-break: break-word;">${formatDate(user.created_at)}</td></tr>
                <tr><td><strong>Last Updated:</strong></td><td style="word-break: break-word;">${formatDate(user.updated_at)}</td></tr>
              </tbody>
            </table>

            ${user.pid ? `
              <h6 class="fw-bold mb-3">AppsFlyer Attribution</h6>
              <table class="table table-sm table-responsive-sm">
                <tbody>
                  <tr><td style="width: 40%;"><strong>PID:</strong></td><td style="word-break: break-word;">${user.pid === null ? 'null' : (user.pid || 'N/A')}</td></tr>
                  <tr><td><strong>Campaign:</strong></td><td style="word-break: break-word;">${user.c === null ? 'null' : (user.c || 'N/A')}</td></tr>
                  <tr><td><strong>Channel:</strong></td><td style="word-break: break-word;">${user.af_channel === null ? 'null' : (user.af_channel || 'N/A')}</td></tr>
                  <tr><td><strong>Ad Set:</strong></td><td style="word-break: break-word;">${user.af_adset === null ? 'null' : (user.af_adset || 'N/A')}</td></tr>
                  <tr><td><strong>Ad:</strong></td><td style="word-break: break-word;">${user.af_ad === null ? 'null' : (user.af_ad || 'N/A')}</td></tr>
                  <tr><td><strong>Keywords:</strong></td><td style="word-break: break-word;">${user.af_keywords === null ? 'null' : (user.af_keywords || 'N/A')}</td></tr>
                  <tr><td><strong>Click Lookback:</strong></td><td style="word-break: break-word;">${user.af_click_lookback === null ? 'null' : (user.af_click_lookback || 'N/A')}</td></tr>
                </tbody>
              </table>
            ` : ''}
          </div>

          <!-- Right Column: Purchase History -->
          <div class="col-md-6">
            <h6 class="fw-bold mb-3">
              <i class="bi bi-receipt"></i> Purchase History
            </h6>
            ${purchaseHistoryHTML}
          </div>
        </div>
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

// Unified Adjust Balance Function
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
      console.log('Balance adjustment coins:', user.coins_balance, typeof user.coins_balance);
      console.log('Balance adjustment RP:', user.rp_balance, typeof user.rp_balance);

      // Populate adjustment form
      document.getElementById('adjustUserId').value = userId;
      document.getElementById('adjustUserName').textContent = user.name || 'N/A';
      document.getElementById('adjustCurrentCoinsBalance').textContent = `${user.coins_balance !== undefined && user.coins_balance !== null ? user.coins_balance : 0} coins`;
      document.getElementById('adjustCurrentRpBalance').textContent = `${user.rp_balance !== undefined && user.rp_balance !== null ? user.rp_balance : 0} RP`;

      // Reset form fields
      document.getElementById('adjustBalanceType').value = '';
      document.getElementById('adjustAmount').value = '';
      document.getElementById('adjustReason').value = '';
      document.getElementById('customReason').value = '';
      document.getElementById('customReasonGroup').style.display = 'none';
      document.getElementById('customReason').required = false;
      document.getElementById('adjustAmountUnit').textContent = 'coins/RP';

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

// Delete User Function
async function deleteUser(userId) {
  try {
    // First get user details for confirmation
    const response = await fetch(`/admin/api/users/${userId}`, {
      credentials: 'same-origin'
    });

    if (response.ok) {
      const result = await response.json();
      const user = result.success ? result.data : result;

      // Build confirmation message
      const message = `Are you sure you want to delete user "${user.name || 'Unknown'}" (${user.email || user.visitor_id})?\n\nThis will:\n• Soft delete the user account\n• Clear personal information\n\nThis action cannot be undone.`;

      // Set up confirmation modal
      document.getElementById('confirmationMessage').textContent = message;
      const confirmBtn = document.getElementById('confirmActionBtn');

      // Remove existing event listeners by cloning the button
      const newConfirmBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

      // Add new event listener
      newConfirmBtn.addEventListener('click', async function() {
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
        modal.hide();

        try {
          // Proceed with deletion
          const deleteResponse = await fetch(`/admin/api/users/${userId}/delete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
          });

          if (deleteResponse.ok) {
            showToast('User deleted successfully', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            const errorResult = await deleteResponse.json();
            showToast(errorResult.message || 'Error deleting user', 'danger');
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          showToast('Network error. Please try again.', 'danger');
        }
      });

      // Show modal
      const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
      modal.show();
    } else {
      const errorResult = await response.json();
      showToast('Error loading user details: ' + (errorResult.message || 'Unknown error'), 'danger');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    showToast('Network error. Please try again.', 'danger');
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
  deleteUser,
  formatDate,
  addLoadingState,
  confirmAction,
  showToast
};