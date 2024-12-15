import { List, Datagrid, TextField, EmailField, 
  Create, Edit, SimpleForm, ReferenceInput, TextInput, NumberInput,
  EditButton, SaveButton, Resource, WithRecord
} from "react-admin";
import { MesswerteListe, MesswertCreate, MesswertEdit, MesswertShow  } from "./messwerte_liste";

export const DbListe = () => {
     return (
         <List>
            <Datagrid>
                <TextField source="name" />
                <TextField source="info" />
                <TextField label="Patch" source="messlänge" />
                <EditButton />
            </Datagrid>
        </List>
     );
};


const redirect = (resource, id, data) => `${data.name}/create`;

export const DbCreate = () => (
  <>
  <Create redirect={redirect}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="info" />
      <TextInput label="Patch" source="messlänge" type="number" />
      </SimpleForm>
  </Create>
  </>
);

export const DbEdit = () => (
    <>
  <Edit title="Messungen: &nbsp;">
        <WithRecord  render={record =>
            <Resource
                           name={record.name}
                           list={MesswerteListe({ messlänge: record.messlänge, name: record.name })}
                           edit={MesswertEdit}
                           show={MesswertShow}
                           create={MesswertCreate({ info: record.info })}
                           options={{ label: record.name }}
                           />
        }/>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="info" />
      <TextInput label="Patch" source="messlänge" type="number" />
    </SimpleForm>

  </Edit>

</>
);
