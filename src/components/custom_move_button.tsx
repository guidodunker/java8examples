import {
    useListContext,
    useUpdateMany,
    useUpdate,
    useRefresh,
    useNotify,
    useUnselectAll,
    Button,
} from 'react-admin';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

function deepClone<T>(items: T[]): T[] {
    return items.map(item => {
        if (Array.isArray(item)) {
            return deepClone(item);  // Handle nested arrays
        } else if (typeof item === 'object' && item !== null) {
            // Correctly cloning each object property
            const clonedObject: any = {};
            for (const key in item) {
                clonedObject[key] = deepClone([item[key]])[0];
            }
            return clonedObject;
        }
        return item;  // Return primitive types unchanged
    });
}

function swap(i1: number, i2: number, dataWork: any[]) {
    console.log("swap " + i1 + ", " + i2)
    var tmp = dataWork[i1];
    dataWork[i1] = dataWork[i2];
    dataWork[i2] = tmp;
    const id1 = dataWork[i1].id;
    const id2 = dataWork[i2].id;
    dataWork[i1].id = id2;
    dataWork[i2].id = id1;
}


export const CustomMoveUpButton = (params:any) => {
    const dbname = params.dbname;
    const { selectedIds, data, onSelect } = useListContext();
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll(dbname);
    const [updateMany] = useUpdateMany();
    const [update, { isPending }] = useUpdate();
    const handleClick = () => {
        if(data) {
            var dataOrig:Array<any> = deepClone(data); 
            var dataWork:Array<any> = deepClone(data); 
            var newSelections:Array<number> = [];
            var selectedPositionList:Array<number> = [];
            console.log("up selectedIds: " + selectedIds)
            for (var selId of selectedIds) {
                const idxInWork = dataWork.findIndex(x => x.id === selId);
                selectedPositionList = selectedPositionList.concat(idxInWork)
            }
            selectedPositionList = selectedPositionList.sort((a,b) => Number(a) - Number(b))
            console.log("up selectedPositionList: " + selectedPositionList)
            if(selectedPositionList.length>0 && selectedPositionList[0]>0) {
                for (var selPos of selectedPositionList) {
                    console.log("up selPos: " + selPos)
                    if(selPos>0) {
                        swap(selPos, selPos-1, dataWork);
                        newSelections = newSelections.concat(dataWork[selPos-1].id)
                    } 
                }
                for (var record of dataWork) {
                    update(dbname, { id: record.id, data: record, previousData: {} } );
                    console.log("update: " + record)
                }
                onSelect(newSelections)
                refresh();   
            }
        } 
    }

    return (
        <Button label="Up" onClick={handleClick} disabled={isPending}>
            <ArrowUpward />
        </Button>
    );
};

export const CustomMoveDownButton = (params:any) => {
    const dbname = params.dbname;
    const { selectedIds, data, onSelect } = useListContext();
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll(dbname);
    const [updateMany] = useUpdateMany();
    const [update, { isPending }] = useUpdate();
    const handleClick = () => {
        if(data) {
            var dataOrig:Array<any> = deepClone(data); 
            var dataWork:Array<any> = deepClone(data); 
            var newSelections:Array<number> = [];
            var selectedPositionList:Array<number> = [];
            console.log("down selectedIds: " + selectedIds)
            for (var selId of selectedIds) {
                const idxInWork = dataWork.findIndex(x => x.id === selId);
                selectedPositionList = selectedPositionList.concat(idxInWork)
            }
            selectedPositionList = selectedPositionList.sort((a,b) => Number(a) - Number(b)).reverse()
            console.log("down selectedPositionList: " + selectedPositionList)
            console.log("down selectedPositionList[0]: " + selectedPositionList[0])
            console.log("down dataWork.length-2: " + (dataWork.length-1))
            if(selectedPositionList.length>0 && selectedPositionList[0]<(dataWork.length-1)) {
                for (var selPos of selectedPositionList) {
                    console.log("down selPos: " + selPos)
                    if(selPos<dataWork.length-1) {
                        swap(selPos, selPos+1, dataWork);
                        newSelections = newSelections.concat(dataWork[selPos+1].id)
                    } 
                }
                for (var record of dataWork) {
                    update(dbname, { id: record.id, data: record, previousData: {} } );
                    console.log("update: " + record)
                }
                onSelect(newSelections)
                refresh();   
            }
        } 
    }

    return (
        <Button label="Down" onClick={handleClick} disabled={isPending}>
            <ArrowDownward />
        </Button>
    );
};