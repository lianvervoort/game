<?php
session_start();

$naam = $_POST['naam'];

?>
<html>

	<head>
		<title> Game </title>
	</head>
	
	<body>
		
		<div align="center" id= "welkom">
			<h2> Welcome, </h2>
			<?php
			$_SESSION['naam'] = $naam;
				if($naam != "" )           //als deze gegevens ingevult zijn 
				{
					$naam = $_POST['naam'];
					$_SESSION['vraag'] = 0;
					 echo $_POST["naam"];				// dan laat je de gegevens zien
				}
				else 
				{
					echo "Graag eerst je naam invullen";							// Anders een link naar index
					echo '<a href=form.html> "Terug naar index"</a>';
				}
			?>
		</div>