import { List, Datagrid, TextField, EmailField, 
  Create, Edit, SimpleForm, ReferenceInput, TextInput, NumberInput,
  EditButton, SaveButton
} from "react-admin";

export const DbListe = () => (
    <List>
        <Datagrid>
            <TextField source="name" />
            <TextField source="info" />
            <TextField label="Patchkabel" source="messlänge" />
            <EditButton />
        </Datagrid>
    </List>
);


const redirect = (resource, id, data) => `${data.name}/create`;

export const DbCreate = () => (
  <>
  <Create redirect={redirect}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="info" />
      <TextInput label="Patchkabel" source="messlänge" type="number" />
      </SimpleForm>
  </Create>
  </>
);

export const DbEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="info" />
      <TextInput label="Patchkabel" source="messlänge" type="number" />
    </SimpleForm>
  </Edit>
);
