<?php
// Original published by Matt West on http://blog.teamtreehouse.com/create-ajax-contact-form  

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        //Exit if the honeypot field contains data
        if(!empty($_POST['website'])) die();
        // Get the form fields and remove whitespace.
        $name = strip_tags(trim($_POST["nameInput"]));
				$name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = filter_var(trim($_POST["emailInput"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["messageInput"]);

        // Check that data was sent to the mailer.
        if ( empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Set a 400 (bad request) response code and exit.
            http_response_code(400);
            echo "Oops, some fields did not pass validation. Please fill out the marked fields.";
            exit;
        }

        // Set the recipient email address.
        $recipient = "stephan@snielsen.de";
        $from = "no-reply@snielsen.de";

        // Set the email subject.
        $subject = "New contact from $name";

        // Build the email content.
        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Message:\n$message\n";

        // Build the email headers.
        $email_headers = "From:  $from";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers, $from)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "Thank you $name! I will reply soon.";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "Oops, something went wrong! Can you try again $name?";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "Oops, there was a problem $name. Please try again.";
    }

?>