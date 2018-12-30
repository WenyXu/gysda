<?php
$admin_email  = 'odesahouse@gmail.com';
//$admin_email = "slivfor@gmail.com";
$method = $_SERVER['REQUEST_METHOD'];

//Script Foreach
$c = true;
if ( $method === 'POST' ) {

	$project_name = trim($_POST["project_name"]);
	$form_subject = trim($_POST["form_subject"]);

	foreach ( $_POST as $key => $value ) {
		if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "form_subject" ) {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
			<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
			<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
		</tr>
		";
	}
}
} else if ( $method === 'GET' ) {

	$project_name = trim($_GET["project_name"]);
	$form_subject = trim($_GET["form_subject"]);

	foreach ( $_GET as $key => $value ) {
		if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "form_subject" ) {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
			<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
			<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
		</tr>
		";
	}
}
}

$message = "<table style='width: 100%;'>$message</table>";

function adopt($text) {
	return '=?UTF-8?B?'.base64_encode($text).'?=';
}
//mail($admin_email, adopt($form_subject), $message, $headers );
$mulmail = new multipartmail($admin_email, $message, adopt($form_subject));
//var_dump($_FILES);
if(isset($_FILES['uploaded_file'])){
    $cid = $mulmail->addattachment($_FILES['uploaded_file'], "octet-stream");
}
$mulmail->addmessage($message);
$mulmail->sendmail();
 class multipartmail{
     var $header;
     var $parts;
     var $message;
     var $subject;
     var $to_address;
     var $boundary;
 
     function multipartmail($dest, $src, $sub){
         $this->to_address = $dest;
         $this->subject = $sub;
         $this->parts = array("");
         $this->boundary = "--" . md5(uniqid(time()));
         $this->header = "From: $src\r\n" .
                         "MIME-Version: 1.0\r\n" .
                         "Content-Type: multipart/mixed; " .
                         " boundary=\"" . $this->boundary . "\"\r\n" .
                         "X-Mailer: PHP/" . phpversion();
     }
 
     function addmessage($msg = "", $ctype = "text/html"){
         $this->parts[0] = "Content-Type: $ctype; charset=UTF-8\r\n" .
                           "Content-Transfer-Encoding: 7bit\r\n" .
                           "\n" .$msg."\r\n";
     }
 
     function addattachment($file, $ctype){
         $fname = $file['name'];
         $data = file_get_contents($file['tmp_name']);
         $i = count($this->parts);
         $content_id = "part$i." . sprintf("%09d", crc32($fname)) . strrchr($this->to_address, "@");
         $this->parts[$i] = "Content-Type: $ctype; name=\"$fname\"\r\n" .
                           "Content-Transfer-Encoding: base64\r\n" .
                           "Content-ID: <$content_id>\r\n" .
                           "Content-Disposition: attachment; " .
                           " filename=\"$fname\"\r\n" .
                           "\n" .
                           chunk_split( base64_encode($data), 68, "\n");
         return $content_id;
     }
 
     function buildmessage(){
         $this->message = "This is a multipart message in mime format.\n";
         $cnt = count($this->parts);
         for($i=0; $i<$cnt; $i++){
           $this->message .= "--" . $this->boundary . "\n" .
                             $this->parts[$i];
         }
     }
 
     /* to get the message body as a string */
     function getmessage(){
         $this->buildmessage();
         return $this->message;
     }
 
     function sendmail(){
         $this->buildmessage();
         var_dump($this->message);
         mail($this->to_address, $this->subject, $this->message, $this->header);
     }
   }