import { useGetList } from 'react-admin';
import { Resource, ShowGuesser, AdminUI } from "react-admin";
import { Layout } from "../Layout";

import { MesswerteListe, MesswertCreate, MesswertEdit } from "./messwerte_liste";
import { DbListe, DbCreate, DbEdit } from "./db_liste";

import PostIcon from '@mui/icons-material/Book';
import UserIcon from '@mui/icons-material/People';

export const WerteListen = () => {
    const { data, total, isPending, error } = useGetList(
        'db',
        { 
            pagination: { page: 1, perPage: 10 },
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
                />
                Datensätze: <br></br>
                {data.map(record =>
                   <Resource
                   name={record.name}
                   list={MesswerteListe}
                   edit={MesswertEdit}
                   show={ShowGuesser}
                   create={MesswertCreate({ info: record.info })}
                   icon={PostIcon}
                   />
                )}
        </AdminUI>
    );
};