(function($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
        if (
            location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                $("html, body").animate({
                        scrollTop: target.offset().top
                    },
                    1000,
                    "easeInOutExpo"
                );
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function() {
        $(".navbar-collapse").collapse("hide");
        $("#legalLinks").collapse("hide");
    });

    $(".navbar-toggler").click(function() {
        $("#legalLinks").collapse("toggle");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#sideNav"
    });
})(jQuery); // End of use strict

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    "use strict";
    window.addEventListener(
        "load",
        function() {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName("needs-validation");
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function(form) {
                form.addEventListener(
                    "submit",
                    function(event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add("was-validated");
                    },
                    false
                );
            });
        },
        false
    );
})();

(function() {
    "use strict";

    new MediumClaps({
        feedUrl: 'https://api.allorigins.ml/get?url=' + encodeURIComponent('https://medium.com/feed/@stephannielsen/has-recommended'),
        missingImage: 'https://source.unsplash.com/random/640x480',
    });
})();

(function() {
    "use strict";
    // Get the form.
    var form = $("#contact-form");

    // Get the messages div.
    var formMessages = $("#form-messages");

    // Set up an event listener for the contact form.
    $(form).submit(function(event) {
        // Stop the browser from submitting the form.
        event.preventDefault();
        $(formMessages).css("visibility", "hidden");

        var formData = $(form).serialize();
        // Submit the form using AJAX.
        $.ajax({
                type: "POST",
                url: $(form).attr("action"),
                data: formData
            })
            .done(function(response) {
                // Make sure that the formMessages div has the 'success' class.
                $(formMessages).removeClass("alert-danger");
                $(formMessages).addClass("alert-success");

                // Set the message text.
                $(formMessages).text(response);
                $(formMessages).css("visibility", "visible");

                // Clear the form.
                $("#nameInput").val("");
                $("#emailInput").val("");
                $("#messageInput").val("");
                $(form).removeClass("was-validated");
            })
            .fail(function(data) {
                // Make sure that the formMessages div has the 'error' class.
                $(formMessages).removeClass("alert-success");
                $(formMessages).addClass("alert-danger");

                // Set the message text.
                if (data.responseText !== "") {
                    $(formMessages).text(data.responseText);
                } else {
                    $(formMessages).text(
                        "Oops! An error occured and your message could not be sent."
                    );
                }
                $(formMessages).css("visibility", "visible");
            });
    });
})();