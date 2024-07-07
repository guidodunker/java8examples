import { List, Datagrid, TextField, EmailField, 
  Create, Edit, SimpleForm, ReferenceInput, TextInput, NumberInput,
  BulkDeleteButton, BulkExportButton,
  downloadCSV,
  EditButton,
  useNotify, Toolbar, SaveButton,
  useListContext
} from "react-admin";
import { useFormContext } from 'react-hook-form';
import { unparse as convertToCSV } from 'papaparse-min/papaparse.min';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { CustomMoveUpButton, CustomMoveDownButton  } from './custom_move_button';

// const { resource } = useListContext();

const PostBulkActionButtons = () => {
  const { resource } = useListContext();
  return (
  <>
      <CustomMoveUpButton   dbname={resource} />
      <CustomMoveDownButton dbname={resource} />
      <BulkDeleteButton />
      <BulkExportButton />
  </>
  )
};


const exporterShare = async (werte) => {
  const csv = convertToCSV({
    data: werte,
    // select and order fields in the export
    fields: ['info', 'länge', 'wert1', 'wert2', 'kommentar']
  });
  var liste: String = ""  
  var count=0;
  for (var data of werte) {
    count++
    liste = liste + 
      "F" + count + ":\n" +
      "L: " + (data.länge ? data.länge : "") + "\n" +
      "1550: " + (data.wert1 ? data.wert1 : "") + "\n" +
      "1625: " + (data.wert2 ? data.wert2 : "") + "\n" + 
      (data.kommentar ? "Kommentar: " + data.kommentar + "\n" : "") +
      "\n"
  }
  const content = liste + "\n\n--------------------------------\n\n" + csv
  const result = await Filesystem.writeFile({
    path:  'werte.txt',
    data: content,
    directory: Directory.Cache,
    encoding: Encoding.UTF8,
    recursive: false
    });
  await Share.share({
    title: 'Messwerte',
    text: 'Hier die gemessenen Werte von ...',
    url: result.uri,
    dialogTitle: 'Teile mit Chef',
  });
}


export const MesswerteListe = () => (
    <List  exporter={exporterShare}>
        <Datagrid  bulkActionButtons={<PostBulkActionButtons />}>
            <TextField source="länge" />
            <TextField source="wert1" />
            <TextField source="wert2" />
            <EditButton />
        </Datagrid>
    </List>
);

const PostCreateToolbar = () => {
  const notify = useNotify();
  const { reset } = useFormContext();

  return (
      <Toolbar>
          <SaveButton
              type="button"
              label="Save"
              variant="text"
              mutationOptions={{
                  onSuccess: () => {
                      reset();
                      window.scrollTo(0, 0);
                      notify('ra.notification.created', {
                          type: 'info',
                          messageArgs: { smart_count: 1 },
                      });
                  },
              }}
          />
      </Toolbar>
  );
};

const action = (k) => {
  if(k.keyCode===13) {
    k.target.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('button').click()
    k.target.parentNode.parentNode.parentNode.querySelectorAll('input')[1].focus()
  }
}

export const MesswertCreate = (aDefaultValue:any) => (
  <>
  <Create redirect={false}>
    <SimpleForm toolbar={<PostCreateToolbar />} defaultValues={aDefaultValue}>
      <TextInput source="info" />
      <TextInput source="länge" type="number" />
      <TextInput source="wert1" type="number" />
      <TextInput source="wert2" type="number" />
      <TextInput source="kommentar" onKeyUp={action} />
    </SimpleForm>
  </Create>
  
  </>
);

export const MesswertEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="info" />
      <TextInput source="länge" type="number" />
      <TextInput source="wert1" type="number" />
      <TextInput source="wert2" type="number" />
      <TextInput source="kommentar" />
    </SimpleForm>
  </Edit>
);
