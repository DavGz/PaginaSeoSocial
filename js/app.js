document.addEventListener("DOMContentLoaded", () => {
  // 1. Año actual en el footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Menú móvil
  const mobileMenuBtn = document.getElementById("mobile-menu");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav-link");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
      mobileMenuBtn.classList.toggle("is-active");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      if (mobileMenuBtn.classList.contains("is-active")) {
        mobileMenuBtn.classList.remove("is-active");
      }
    });
  });

  // 3. Header que se compacta al hacer scroll
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 4. Animaciones "Reveal on Scroll"
  const revealElements = document.querySelectorAll(".reveal");

  const revealFunction = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", revealFunction);
  revealFunction();

  // 5. Integración con Blogger vía JSONP
  // JSONP inyecta un <script> directamente — no existe bloqueo CORS porque no es fetch()
  const loadBloggerPosts = () => {
    const blogContainer = document.getElementById("blog-posts-container");
    if (!blogContainer) return;

    // Esta función global es llamada automáticamente por Blogger al ejecutar el <script>
    window.handleBloggerData = (data) => {
      const entries = data.feed.entry;

      if (!entries || entries.length === 0) return;

      blogContainer.innerHTML = ""; // Eliminar tarjetas placeholder

      entries.forEach((post) => {
        // Título
        const title = post.title.$t;

        // Enlace al artículo
        const linkObj = post.link.find((l) => l.rel === "alternate");
        const link = linkObj ? linkObj.href : "#";

        // Fecha formateada en español
        const date = new Date(post.published.$t);
        const dateStr = date.toLocaleDateString("es-ES", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        // Contenido HTML del post
        const content = post.content
          ? post.content.$t
          : post.summary
            ? post.summary.$t
            : "";

        // Buscar imagen dentro del contenido
        let imgTag = content.match(/<img[^>]+src="([^">]+)"/);
        let imgSrc = imgTag ? imgTag[1] : "";

        // Si no hay imagen en el contenido, usar el thumbnail de Blogger en alta resolución
        if (!imgSrc && post["media$thumbnail"]) {
          imgSrc = post["media$thumbnail"].url.replace("/s72-c/", "/s600/");
        }

        // Texto limpio para el resumen
        const plainText = content.replace(/<[^>]*>?/gm, "").trim();
        const summary =
          plainText.length > 150
            ? plainText.substring(0, 150) + "..."
            : plainText || "Leer artículo completo en el blog.";

        const articleHTML = `
          <article class="blog-card">
            <div class="blog-img-placeholder" style="${
              imgSrc
                ? `background-image: url('${imgSrc}'); background-size: cover; background-position: center; padding:0; border:none;`
                : ""
            }">
              ${!imgSrc ? "<span>[Sin imagen destacada]</span>" : ""}
            </div>
            <div class="blog-content">
              <span class="blog-date">${dateStr}</span>
              <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${title}</h3>
              <p style="font-size: 0.9rem; color: var(--color-text-muted);">${summary}</p>
              <a href="${link}" target="_blank" rel="noopener noreferrer" class="read-more">Leer artículo &rarr;</a>
            </div>
          </article>
        `;
        blogContainer.insertAdjacentHTML("beforeend", articleHTML);
      });

      // Limpiar el script del DOM tras su ejecución
      const oldScript = document.getElementById("blogger-jsonp");
      if (oldScript) oldScript.remove();
      delete window.handleBloggerData;
    };

    // Inyectar el script JSONP al final del body
    const script = document.createElement("script");
    script.id = "blogger-jsonp";
    script.src =
      "https://danieluzcateguispecth.blogspot.com/feeds/posts/default?alt=json-in-script&max-results=3&callback=handleBloggerData";
    script.onerror = () => {
      console.error("No se pudo conectar con el blog de Blogger.");
    };
    document.body.appendChild(script);
  };

  loadBloggerPosts();

  // 6. Comportamiento del menú desplegable interactivo en tablets y dispositivos táctiles
  const dropdownToggle = document.getElementById("nav-trajectory-toggle");
  const dropdownContainer = document.getElementById("dropdown-trajectory-container");

  if (dropdownToggle && dropdownContainer) {
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownContainer.classList.toggle("is-open");
      const expanded = dropdownContainer.classList.contains("is-open");
      dropdownToggle.setAttribute("aria-expanded", expanded);
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener("click", (e) => {
      if (!dropdownContainer.contains(e.target)) {
        dropdownContainer.classList.remove("is-open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Cerrar dropdown al hacer clic en un enlace de item
    const dropdownItems = dropdownContainer.querySelectorAll(".dropdown-item");
    dropdownItems.forEach(item => {
      item.addEventListener("click", () => {
        dropdownContainer.classList.remove("is-open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      } );
    });
  }
});
