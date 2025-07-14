// Initialize immediately since we're injecting dynamically
if (!window.navbarInitialized) {
  window.navbarInitialized = true;

  // Immediately invoke after navbar is loaded
  (function initNavbar() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');

    if (menuToggle && menu) {
      menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
      });
    }

    const navLinks = document.querySelectorAll('#menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        if (menu.classList.contains('active')) {
          menu.classList.remove('active');
        }

      });
    });

    checkAuthState();
    fetchProfilePic();
  })();
}


// Auth Functions
async function checkAuthState() {
  const login = document.getElementById('login-btn');
  const profileDiv = document.getElementById('profileHolder');

  if (!login || !profileDiv) return;

  try {
    const res = await fetch('/cutlab/checkLoginStatus'); // adjust path as needed
    const data = await res.json();

    if (data.loginStatus) {
      login.style.display = 'none';
      profileDiv.style.display = 'inline-block';
    } else {
      login.style.display = 'inline-block';
      profileDiv.style.display = 'none';
    }
  } catch (error) {
    console.error('Error checking login state:', error);
    login.style.display = 'inline-block';
    profileDiv.style.display = 'none';
  }
}


function fetchProfilePic(){
  const profileImgForNav = document.getElementById('profilePicNav');
  if (!profileImgForNav) return;

  fetch('/cutlab/GetProfilePicture')
    .then(response =>response.json())
    .then(data => {
      if (data.status == 'success') {
        profileImgForNav.src = "images/user_profile/" +data.url+ '?t=' + Date.now();
      }else{
        profileImgForNav.src = "images/user_profile/nouser.jpg?t=" + Date.now();
      }
    })
    .catch(() => {
      profileImgForNav.src = "images/user_profile/nouser.jpg?t=" + Date.now();
    });
}








