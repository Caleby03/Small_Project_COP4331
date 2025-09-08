<?php
	$inData = getRequestInfo();
	$userId = $inData["userId"];
	$contactId = $inData["contactId"];
	
	$conn = new mysqli("localhost", "UnNamed", "Small", "COP4331", 3306); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Build dynamic update query
		$fieldsToUpdate = array();
		$types = "";
		$values = array();
		
		if(isset($inData["firstName"])) {
			$fieldsToUpdate[] = "FirstName=?";
			$types .= "s";
			$values[] = $inData["firstName"];
		}
		if(isset($inData["lastName"])){
			$fieldsToUpdate[] = "LastName=?"; 
			$types .= "s"; 
			$values[] = $inData["lastName"]; 
		}
		if(isset($inData["email"])){
			$fieldsToUpdate[] = "Email=?"; 
			$types .= "s"; 
			$values[] = $inData["email"]; 
		}
		if(isset($inData["phone"])){
			$fieldsToUpdate[] = "Phone=?"; 
			$types .= "s"; 
			$values[] = $inData["phone"]; 
		}
		
		if(empty($fieldsToUpdate))
		{
			returnWithError("No fields to update provided.");
		}
		else
		{
			$stmt = $conn->prepare("SELECT COUNT(*) FROM Contacts WHERE UserID=? AND ID=?");
			$stmt->bind_param("ii", $userId, $contactId); 
			$stmt->execute(); 
			$result = $stmt->get_result(); 
			$row = $result->fetch_row(); 
			
			if($row[0] == 0)
			{
				returnWithError("Contact not found.");
			}
			else
			{
				$stmt->close();
				$sql = "UPDATE Contacts SET " . implode(", ", $fieldsToUpdate) . " WHERE UserID=? AND ID=?";
				$values[] = $userId; 
				$values[] = $contactId; 
				$types .= "ii";
				
				$stmt = $conn->prepare($sql);
				$stmt->bind_param($types, ...$values);
				$stmt->execute();
				
				if($stmt->affected_rows == 1)
				{
					returnWithError(""); 
				}
				else
				{
					returnWithError("No changes were made.");
				}
			}
			$stmt->close();
		}
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
	
	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
