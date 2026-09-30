/* =========================================================
   MEDICARE
   JavaScript general
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       NAVEGACIÓN SUAVE
    ===================================================== */

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       ANIMACIONES AL HACER SCROLL
    ===================================================== */

    const animatedElements = document.querySelectorAll(
        ".service-card, " +
        ".mission-card, " +
        ".contact-card, " +
        ".access-card, " +
        ".about-panel"
    );


    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "show-element"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


        animatedElements.forEach(element => {

            element.classList.add(
                "hidden-element"
            );

            observer.observe(element);

        });

    }


    /* =====================================================
       EFECTO DE BOTONES
    ===================================================== */

    const buttons = document.querySelectorAll(
        ".btn-primary, " +
        ".btn-secondary, " +
        ".about-button, " +
        ".cta-button, " +
        ".access-button"
    );


    buttons.forEach(button => {

        button.addEventListener("click", () => {

            button.classList.add(
                "button-clicked"
            );

            setTimeout(() => {

                button.classList.remove(
                    "button-clicked"
                );

            }, 250);

        });

    });


    /* =====================================================
       AÑO AUTOMÁTICO DEL FOOTER
    ===================================================== */

    const yearElement = document.querySelector(
        "#current-year"
    );


    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


});