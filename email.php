<?php

$dados = $_POST;
$email = trim(strtolower($dados['email_contato']));

if (empty($dados['email']) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erro = false;
    $spam = false;

    $ip = getenv('REMOTE_ADDR');
    $data = date('d/m/Y');
    $hora = date('H:i:s');

    //tratamento dos dados do formulario
    $nome = utf8_decode(ucfirst($dados['nome_contato']));
    $msg = str_replace(array("\r\n", "\r", "\n", '\\r', '\\n', '\\r\\n'), '<br/>', nl2br($dados['mensagem_contato']));
    $telefone = $dados['telefone_contato'] == '' ? 'Não informado' : $dados['telefone_contato'];
    $empresa = $dados['empresa_contato'] == '' ? 'Não informado' : $dados['empresa_contato'];

    if ($nome == '' || $email == '' || $msg == '') {
        $erro = true;
    }
    require_once 'class/library/phpmailer/class.smtp.php';
    require_once 'class/library/phpmailer/class.phpmailer.php';
    
    $html = "
    <h1>Site | Natalia Alves</h1>
    <div style='display:block; padding-bottom: 10px;'>
    <p style='color: #000'><strong>Nome:</strong> " .$nome."</p>
    <p style='color: #000'><strong>Empresa:</strong> " .$empresa."</p>
    <p style='color: #000'><strong>Email:</strong> " .$email."</p>
    <p style='color: #000'><strong>Telefone:</strong> " .$telefone."</p>
    </div>
    <div style='display:block; padding-bottom: 10px;'>
    <p style='font-size:20px; color:#000;'>" .$msg."</p>
    </div>
    ";
    
    $mail = new PHPMailer();
    $mail->CharSet = 'UTF-8';
    $mail->SetLanguage('br');
    $mail->IsSMTP();
    $mail->IsHTML(true);
    $mail->SMTPAuth = true;
    $mail->Host = 'mail.nataliaalves.com.br';
    $mail->Port = 587;
    $mail->From = 'web@nataliaalves.com.br';
    $mail->Username = 'web@nataliaalves.com.br';
    $mail->Password = 'xxx';

    $mail->FromName = 'Site | Natalia Alves';
    $mail->addReplyTo($email, $nome);
    $mail->addAddress('contato@nataliaalves.com.br');

    $mail->Subject = 'Contato do site Natalia Alves';
    $mail->Body .= $html;

    if (!$erro) {
        $mail->Send();
        echo json_encode(array('status' => true, 'msg' => 'Obrigada! Recebi sua mensagem.', 'role' => 'success'));
        exit();
    } else {
        echo json_encode(array('status' => false, 'msg' => 'Preencha os campos obrigatórios.', 'role' => 'alert'));
        die();
    }
} else {
    echo json_encode(array('status' => false, 'msg' => 'Email "'.$email.'" Inválido.', 'role' => 'danger'));
    die();
}
