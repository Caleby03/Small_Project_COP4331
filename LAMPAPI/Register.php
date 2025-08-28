
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "UnNamed", "Small", "COP4331", 3306); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $stmt = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE FirstName=? AND LastName =?");
		$stmt->bind_param("ss", $inData["firstName"], $inData["lastName"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] , "User Already Exists");
		}
		else
		{
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES(?, ?, ?, ?)");
		    $stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);
		    $stmt->execute();
		    $result = $stmt->affected_rows();
            returnSuccess($result);
            if( $row = $result->fetch_assoc()  )
            {
                returnSuccess("True");
            }
            else
            {
                returnSuccess("False");
            }
		}
		

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id , $error)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":"' . $error . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function returnSuccess($success)
    {
        $retValue = '{"userAdded":"' .$success. '","error":""}';
        sendResultInfoAsJson( $retValue );
    }
	
?>
