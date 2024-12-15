import { useGetList } from 'react-admin';
import { Resource, ShowGuesser, AdminUI } from "react-admin";
import { Layout } from "../Layout";

import { MesswerteListe, MesswertCreate, MesswertEdit, MesswertShow  } from "./messwerte_liste";
import { DbListe, DbCreate, DbEdit } from "./db_liste";

import PostIcon from '@mui/icons-material/Book';
import UserIcon from '@mui/icons-material/People';

export const WerteListen = () => {
    const { data, total, isPending, error } = useGetList(
        'db',
        { 
            pagination: { page: 1, perPage: 500 },
            sort: { field: 'id', order: 'ASC' }
        }
    );
    if (isPending) { return "Loading"; }
    if (error) { return <p>ERROR</p>; }
    return (
        <AdminUI layout={Layout} i >
                <Resource
                    name="db"
                    list={DbListe}
                    edit={DbEdit}
                    show={ShowGuesser}
                    create={DbCreate}
                    icon={UserIcon}
                    options={{ label: 'Messungen' }}
                />
                Datensätze: <br></br>
                {data.map(record =>
                   <Resource
                   name={record.name}
                   list={MesswerteListe({ messlänge: record.messlänge, name: record.name })}
                   edit={MesswertEdit}
                   show={MesswertShow}
                   create={MesswertCreate({ info: record.info })}
                   icon={PostIcon}
                   options={{ label: record.name }}
                   />
                )}
        </AdminUI>
    );
};