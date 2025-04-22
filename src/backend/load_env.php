<?php

// run this command to get the Dotenv working : composer require vlucas/phpdotenv

require '../../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();
?>