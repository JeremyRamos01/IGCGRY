const navbarHTML = `
    <!-- BARRA DE NAVEGACIÓN -->
    <nav class="navbar navbar-expand-lg fixed-top glass-nav">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="index.html">
                <img class="logo img-fluid" src="img/Logo.png" alt="Logo Iglesia Del Gran REY">
                <span class="ms-3 ps-3 border-start border-2 text-white fw-bold d-none d-md-block fs-5"
                    style="border-color: rgba(255,255,255,0.3) !important; letter-spacing: 1px;">Casa del Gran
                    REY</span>
            </a>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fa-solid fa-bars text-white fs-3"></i>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav align-items-center">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">Inicio</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="quienes-somos.html">Quiénes Somos</a>
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
                    <li class="nav-item ms-lg-3 mt-3 mt-lg-0">
                        <a class="btn btn-gold" href="contacto.html">Contacto</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
`;

document.write(navbarHTML);

// Marcar la página actual como 'active'
document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos el nombre del archivo actual, si está vacío asumimos index.html
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .btn');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.parentElement.classList.add('active');
        }
    });
});
