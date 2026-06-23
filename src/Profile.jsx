import { Field, Flex, Button, Input, Text, Spinner, Table } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";

function Profile() {
  const { data, setData } = useDataStore();
  
  const back = () => {
    setData({
      ...data,
      page : 'dashboard',
    });
  };

  return (
    <>
      <Text size='xl' m={100}>Profile&mdash;Change your display name, contact info, active/away status, password, etc.</Text>
      
      <Button colorPalette="grey" variant="solid" onClick={back} mt="20">Back</Button>
    </>
  );
}

export default Profile;