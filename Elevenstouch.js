    const menuIcon = document.getElementById('menu-icon');
    const navContainer = document.getElementById('nav-container');

    menuIcon.addEventListener('click', () => {
        navContainer.classList.toggle('active');
    });

    