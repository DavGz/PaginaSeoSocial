document.addEventListener('DOMContentLoaded', () => {
    // 1. Establecer el año actual en el footer
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Manejo del menú móvil
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Animación del botón hamburguesa (opcional)
            mobileMenuBtn.classList.toggle('is-active');
        });
    }

    // Cerrar el menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            if(mobileMenuBtn.classList.contains('is-active')) {
                mobileMenuBtn.classList.remove('is-active');
            }
        });
    });

    // 3. Efecto de cambio en el Header al hacer scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Animaciones "Reveal on Scroll"
    const revealElements = document.querySelectorAll('.reveal');

    const revealFunction = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // Cuándo debe aparecer el elemento (px antes del borde inferior)

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    // Escuchar evento scroll
    window.addEventListener('scroll', revealFunction);
    
    // Ejecutar una vez al cargar por si hay elementos visibles inicialmente
    revealFunction();
});
