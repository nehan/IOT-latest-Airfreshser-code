<?php
$servername = "mysql4.000webhost.com";
$username   = "a4521868_test";
$password   = "abc123";
$dbname     = "a4521868_air";
// $servername = "localhost";
// $username   = "root";
// $password   = "";
// $dbname="iot";
$method     = $_SERVER['REQUEST_METHOD'];
$conn = new mysqli($servername, $username, $password, $dbname);

            // Check connection
    if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
				echo "connection failed";
    }
	else{
		if ($method == 'GET' && $_GET['operation']=='login' ){
			if (isset($_GET['user_name'])&& isset($_GET['password'])){
				$username = $_GET['user_name'];
				$password = $_GET['password'];
				$sql = "SELECT * FROM user where username = '$username' and password='$password'";
            
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                // output data of each row
                while ($row = $result->fetch_assoc()) {
                    $array[] = $row;
                }
               echo $_GET['callback']."(".json_encode($array).")";
            
            } else {
                echo json_encode(array(
                    'users' => null
                ));
            }
            $conn->close();
			}
		} 
		else if($method == 'GET' && $_GET['operation']=='checkflag'){
			if (isset($_GET['user_name'])){
				$username = $_GET['user_name'];
				$sql = "SELECT activate FROM user where username = '$username'";
                
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                // output data of each row
                while ($row = $result->fetch_assoc()) {
                    $array[] = $row;
      //               if($row["activate"]=="yes"){
      //                	$sql_update = "UPDATE user SET activate=no WHERE username='$user_name'";
						// $result_update = $conn->query($sql_update);
						// printf ("Updated records: %d\n", mysql_affected_rows());
						// mysql_query("COMMIT");

      //               }
                    
                }
               
                 echo $_GET['callback']."(".json_encode($array).")";
            } else {
                echo json_encode(array(
                    'users' => null
                ));
            }
            $conn->close();
			}
		}
		else if($method == 'GET' && $_GET['operation']=='insert' ){
			    
				if(isset($_GET['user_name']) && isset($_GET['password'])){
					$username_insert = $_GET['user_name'];
					$password_insert = $_GET['password'];
					$home=$_GET['home_address'];
					$sql = "INSERT INTO user (username, password,home_address)
					VALUES ('$username_insert', '$password_insert','$home')";
			     	$result = $conn->query($sql);
					if ($result) {
						$data=array('users' => $result);
						// echo json_encode(array(
						// 	'users' => $result
						// ));

						//echo $_GET['callback']."(".json_encode(array('users' => $result).")";
 						echo $_GET['callback']."(".json_encode($data).")";

						
					} else {
						echo "Failed";
					}
				}
		}
		else if($method == 'GET' && $_GET['operation']=='update'){
			if(isset($_GET['activate'])&& (isset($_GET['user_name']))){
				$activate_flag=$_GET['activate'];
				$user_name = $_GET['user_name'];
				$sql = "UPDATE user SET activate='$activate_flag' WHERE username='$user_name'";
				if ($conn->query($sql) === TRUE) {
					//echo json_encode(array(
					//			'update' => TRUE
					//			));
                     $data=array('update' => TRUE);
					 echo $_GET['callback']."(".json_encode($data).")";
				} else {
					echo "Error updating record: " . $conn->error;
				}
			}
			 
		}
	}