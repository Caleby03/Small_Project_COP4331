<?php
    //php be difficult man - Ameer
    $inData = getRequestInfo();


    $userId = $inData["userId"];

	$conn = new mysqli("localhost", "UnNamed", "Small", "COP4331", 3306);

    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }
    else{
        $stmt = $conn->prepare("SELECT ID, FirstName,LastName,Email,Phone, DateRecorded FROM Contacts WHERE
        UserID=? ORDER BY FirstName, LastName");
        $stmt->bind_paramm("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        $contacts = array();
        while($row = $result->fetch_assoc()){
            $contacts[] = $row;
        }
        $stmt->clsoe();
        $conn->close();

        sendResultInfoAsJson(json_encode(array("results"=>$contacts,"error"=>"")));


    }

    function getRequestInfo(){
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj){
        $retVal = '{"results:[],"error":"'.$err.'"}';
        sendResultInfoAsJson($retVal);
    }



?>
