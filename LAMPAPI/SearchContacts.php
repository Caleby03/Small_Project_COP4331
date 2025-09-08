<?php
    //php be difficult man - Ameer
    $inData = getRequestInfo();


    $userId = $inData["ID"];

	$conn = new mysqli("localhost", "UnNamed", "Small", "COP4331", 3306);

    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }
    else{
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email, PhoneNumber, DateRecorded FROM Contacts WHERE ID=? ORDER BY FirstName, LastName");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        $contacts = array();
        while($row = $result->fetch_assoc()){
            $contacts[] = array(
                "id" => $row['ID'],
                "firstName" => $row['FirstName'],
                "lastName" => $row['LastName'],
                "email" => $row['Email'],
                "phone" => $row['PhoneNumber'],
                "dateRecorded" => $row['DateRecorded']
            );
        }
        $stmt->close();
        $conn->close();

        sendResultInfoAsJson(json_encode(array("results"=>$contacts,"error"=>"")));


    }

    function getRequestInfo(){
        return json_decode(file_get_contents('php://input'), true);
    }

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithError($err)
    {
        $retValue = '{"results":[],"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

?>
