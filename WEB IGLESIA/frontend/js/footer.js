const footerHTML = `
    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-4 mb-4 mb-lg-0">
                    <img src="img/Logo.png" alt="Logo" style="width: 80px; margin-bottom: 20px;">
                    <p class="pe-lg-4">Iglesia Evangélica Casa del Gran REY. Un lugar para conocer a Dios y crecer en fe.</p>
                    <p class="mb-2" style="font-size: 0.82rem; color: rgba(255,255,255,0.45);"><i class="fa-solid fa-file-circle-check me-1"></i>Nº Registro: 024973</p>
                    <div class="social-icons mt-4">
                        <a href="https://www.facebook.com/carlos.pinedaaraujo/" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="https://www.tiktok.com/@casadelgranrey" target="_blank"><i class="fa-brands fa-tiktok"></i></a>
                    </div>
                </div>
                <div class="col-lg-4 mb-4 mb-lg-0">
                    <h5>Enlaces Rápidos</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2"><a href="#inicio">Inicio</a></li>
                        <li class="mb-2"><a href="quienes-somos.html">Conócenos</a></li>
                        <li class="mb-2"><a href="biblioteca.html">Biblioteca</a></li>
                        <li class="mb-2"><a href="eventos.html">Eventos</a></li>
                        <li class="mb-2"><a href="chat.html">Foro Libre</a></li>
                        <li class="mb-2"><a href="contacto.html">Ubicaciones</a></li>
                        <li class="mb-2"><a href="donar.html"><i class="fa-solid fa-hand-holding-heart me-1" style="color: var(--accent-gold);"></i>Donar</a></li>
                    </ul>
                </div>
                <div class="col-lg-4">
                    <h5>Contacto</h5>
                    <ul class="list-unstyled">
                        <li class="mb-3"><i class="fa-solid fa-location-dot me-2 text-gold" style="color: var(--accent-gold);"></i> <a href="https://www.google.com/maps/search/?api=1&query=Iglesia+Evangélica+Casa+del+Gran+REY+Leganés" target="_blank" style="text-decoration: none; color: inherit;">C. del Priorato, 34, 28915 Leganés, Madrid</a></li>
                        <li class="mb-3"><i class="fa-brands fa-whatsapp me-2" style="color: var(--accent-gold);"></i> <a href="https://wa.me/34624480351" target="_blank" style="text-decoration: none; color: inherit;">624 48 03 51</a></li>
                        <li class="mb-3"><i class="fa-regular fa-clock me-2" style="color: var(--accent-gold);"></i> Horarios: Mar, Jue (19h-20h), Sáb (19h-21h), Dom (12h-14h)</li>
                    </ul>
                </div>
            </div>
            <hr class="mt-5 mb-4" style="border-color: rgba(255,255,255,0.1);">
            <div class="row align-items-center">
                <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                    <p class="mb-0 text-white-50" style="font-size: 0.9rem;">&copy; 2026 Iglesia Evangélica Casa Del Gran REY. Todos los derechos reservados.</p>
                </div>
                <div class="col-md-6 text-center text-md-end">
                    <ul class="list-inline mb-0" style="font-size: 0.85rem;">
                        <li class="list-inline-item"><a href="aviso-legal.html" class="text-white-50 text-decoration-none">Aviso Legal</a></li>
                        <li class="list-inline-item text-white-50">|</li>
                        <li class="list-inline-item"><a href="politica-privacidad.html" class="text-white-50 text-decoration-none">Política de Privacidad</a></li>
                        <li class="list-inline-item text-white-50">|</li>
                        <li class="list-inline-item"><a href="politica-cookies.html" class="text-white-50 text-decoration-none">Política de Cookies</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>

    <!-- COOKIE BANNER -->
    <div id="cookie-banner" style="display: none; position: fixed; bottom: 0; left: 0; width: 100%; background-color: var(--primary-dark); color: white; padding: 20px; z-index: 9999; box-shadow: 0 -4px 10px rgba(0,0,0,0.2);">
        <div class="container d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div class="mb-3 mb-md-0 pe-md-4">
                <p class="mb-1" style="font-size: 0.95rem;">Utilizamos cookies propias y de terceros (como Firebase) para asegurar el correcto funcionamiento de la web y el foro. <a href="politica-cookies.html" class="text-gold" style="color: var(--accent-gold);">Más información</a>.</p>
            </div>
            <div class="d-flex gap-2">
                <button id="btn-accept-cookies" class="btn btn-warning fw-bold px-4">Aceptar</button>
            </div>
        </div>
    </div>
`;

document.write(footerHTML);

document.addEventListener('DOMContentLoaded', () => {
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    
    // Configurar enlaces si no estamos en index.html
    if (!isHomePage) {
        document.querySelectorAll('.footer a[href^="#"]').forEach(anchor => {
            const href = anchor.getAttribute('href');
            anchor.setAttribute('href', 'index.html' + href);
        });
    }

    // Lógica del Banner de Cookies
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('btn-accept-cookies');

    if (!localStorage.getItem('cookie_consent')) {
        cookieBanner.style.display = 'block';
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'true');
        cookieBanner.style.display = 'none';
    });
});
