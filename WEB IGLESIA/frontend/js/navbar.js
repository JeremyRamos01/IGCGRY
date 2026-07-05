const navbarHTML = `
    <!-- BARRA DE NAVEGACIÓN -->
    <nav class="navbar navbar-expand-lg fixed-top glass-nav">
        <div class="container-fluid px-2">
            <a class="navbar-brand d-flex align-items-center" href="/">
                <img class="logo img-fluid" src="img/Logo.png" alt="Logo Iglesia Del Gran REY">
                <div class="d-none d-md-flex flex-column ms-3 ps-3 border-start border-2" style="border-color: rgba(255,255,255,0.3) !important;">
                    <span class="fw-bold fs-5 text-white" style="letter-spacing: 1px;">Casa del Gran REY</span>
                    <span style="font-size: 0.7rem; color: rgba(255,255,255,0.75); letter-spacing: 0.5px; margin-top: 2px;">
                        <i class="fa-solid fa-church me-1 text-gold"></i> Cultos: Sáb a partir de 19:00h | Dom a partir de 12:00h
                    </span>
                    <span style="font-size: 0.65rem; color: rgba(255,255,255,0.5); margin-top: 1px;">
                        Nº Registro: 024973
                    </span>
                </div>
            </a>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fa-solid fa-bars text-white" style="font-size: 1.5rem;"></i>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav align-items-center">
                    <li class="nav-item">
                        <a class="nav-link" href="#inicio">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="quienes-somos.html">Conócenos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="biblioteca.html">Biblioteca</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="eventos.html">Eventos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="chat.html">Foro Libre</a>
                    </li>
                    <li class="nav-item ms-lg-2 mt-2 mt-lg-0">
                        <a class="btn-donate-nav" href="donar.html"><i class="fa-solid fa-hand-holding-heart me-1"></i>Donar</a>
                    </li>
                    <li class="nav-item ms-lg-2 mt-2 mt-lg-0">
                        <a class="btn btn-primary-custom" href="contacto.html">Contáctanos</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
`;

document.write(navbarHTML);

document.addEventListener('DOMContentLoaded', () => {
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    
    // Update links if not on homepage
    if (!isHomePage) {
        document.querySelectorAll('a.nav-link').forEach(anchor => {
            const href = anchor.getAttribute('href');
            if (href && href.startsWith('#')) {
                anchor.setAttribute('href', 'index.html' + href);
            }
        });
    } else {
        // Smooth scrolling for navbar links only on homepage
        document.querySelectorAll('a.nav-link').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 90,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
});
