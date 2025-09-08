 <?php
	$inData = getRequestInfo();
	$userId = $inData["userId"];
	$contactId=$inData["contactId"];
	$conn = new mysqli("localhost", "UnNamed", "Small", "COP4331", 3306);

	if ($conn->connect_error)

	{

		returnWithError( $conn->connect_error );

	}

	else
	{
		$stmt = $conn->prepare("SELECT COUNT(*) FROM Contacts WHERE UserID=? AND ID=?");
		$stmt->bind_param("ii",$userId,$contactId);
		$stmt->execute();
		$result=$stmt->get_result();
		$row=$result->fetch_row();

		if($row[0]==0)
		{
			returnWithError( "User was not found, therefore they were not deleted.");
		}
		else
		{
			$stmt->close();
			$stmt=$conn->prepare("DELETE FROM Contacts WHERE UserID=? AND ID=?");
			$stmt->bind_param("ii",$userId,$contactId);
			$stmt->execute();

			if($stmt->affected_rows==1)
			{
				returnWithError("");
			}
			else
			{
				returnWithError("An error occurred. Please try again.");
			}

		}
		$stmt->close();
		$conn->close();

	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'),true);
	}


	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}


	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
