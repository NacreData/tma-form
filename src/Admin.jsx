import { Field, Flex, Button, Input, Text, Spinner, Table } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";

function Admin() {
  const { data, setData } = useDataStore();
  
  const back = () => {
    setData({
      ...data,
      page : 'dashboard',
    });
  };

  return (
    <>
      <Text size='xl' m={100}>Admin&mdash;(requires extra permission) Manage other users of this system.</Text>
      
      <Button colorPalette="grey" variant="solid" onClick={back} mt="20">Back</Button>
    </>
  );
}

export default Admin;