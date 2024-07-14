import { List, Datagrid, TextField, EmailField, 
  Create, Edit, SimpleForm, ReferenceInput, TextInput, NumberInput,
  BulkDeleteButton, BulkExportButton,
  downloadCSV,
  EditButton,
  useNotify, Toolbar, SaveButton,
  useListContext, Show, SimpleShowLayout
} from "react-admin";
import { useFormContext } from 'react-hook-form';
import { unparse as convertToCSV } from 'papaparse-min/papaparse.min';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { CustomMoveUpButton, CustomMoveDownButton  } from './custom_move_button';


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


const komma = (str?:String) => {
  if((!str) || str.length===0) {
    return "0,0"
  }
  if(str.length===1) {
    return str + ",0"
  }
  const s1 = str.substring(0,1)
  const s2 = str.substring(1)
  return s1 + "," + s2
}

const korrigierteLänge = (länge: number|undefined, messlänge: number) => {
  if(länge) {
    return länge - messlänge
  } else {
    return "";
  }
}

export const MesswerteListe = (aDefaultValue:any) => {

  const exporterShare = async (werte) => {
    var messlänge:number|undefined = undefined;
    var messlängeHinweis = "";
    var messungName = "Messwerte";
    if(aDefaultValue.name) {
      messungName = aDefaultValue.name
    }

    if(aDefaultValue?.messlänge) {
      messlänge = +(aDefaultValue?.messlänge);
      messlängeHinweis = "Das Patchkabel mit der Länge von " + messlänge + " Metern wurde abgezogen. \n\n";
    } else {
      messlänge = 0;
    }

    var csvString = "Info; Länge; 1550; 1625; Kommentar\n";
    for (var data of werte) {
      csvString = csvString + (data.info ? data.info : "") + ";"
      csvString = csvString + korrigierteLänge(data.länge, messlänge) + ";"
      csvString = csvString + komma(data['_1550']) + ";"
      csvString = csvString + komma(data['_1625']) + ";"
      csvString = csvString + (data.kommentar ? data.kommentar : "") + "\n"
    }
    
    var liste: String = messlängeHinweis 
    var count=0;
    for (var data of werte) {
      count++
      liste = liste + 
        "F" + count + ":\n" +
        "L: " + korrigierteLänge(data.länge, messlänge) + "\n" +
        "1550: " + komma(data['_1550']) + "\n" +
        "1625: " + komma(data['_1625']) + "\n" + 
        (data.kommentar ? "Kommentar: " + data.kommentar + "\n" : "") +
        "\n"
    }
    const content = liste + "\n\n--------------------------------\n\n" + csvString
    console.log("content: " + content)
    const result = await Filesystem.writeFile({
      path:  'werte.txt',
      data: content,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
      recursive: false
      });
    await Share.share({
      title: 'Messwerte: ' + messungName,
      text: 'Hier die gemessenen Werte der Messung: ' + messungName,
      url: result.uri,
      dialogTitle: 'Teile',
    });
  }
  

  return (
    <List  exporter={exporterShare}>
        <Datagrid  bulkActionButtons={<PostBulkActionButtons />}>
            <TextField source="länge" />
            <TextField source="_1550" />
            <TextField source="_1625" />
            <EditButton />
        </Datagrid>
    </List>
  )
};

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
      <TextInput source="_1550" type="number" />
      <TextInput source="_1625" type="number" />
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
      <TextInput source="_1550" type="number" />
      <TextInput source="_1625" type="number" />
      <TextInput source="kommentar" />
    </SimpleForm>
  </Edit>
);

export const MesswertShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField  source="info" />
      <TextField  source="länge"  />
      <TextField  source="_1550"  />
      <TextField  source="_1625"  />
      <TextField  source="kommentar" />
    </SimpleShowLayout>
  </Show>
);