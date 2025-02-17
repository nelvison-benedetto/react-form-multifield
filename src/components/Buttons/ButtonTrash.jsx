//ButtonTrash.jsx
export default function ButtonTrash({mangaId, onTrashManga}){ //i nomi delle props devono essere IDENTICI a quelli dichiarati nel father
    return(
        <button onClick={() => onTrashManga(mangaId)} className="btn btn-danger">  {/*executed only when cliccked*/}
            <i className='bi bi-trash'></i>
        </button>
    );
}