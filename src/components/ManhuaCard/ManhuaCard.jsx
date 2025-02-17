//ManhuaCard.jsx
import ButtonBuy from '../Buttons/ButtonBuy'
import ButtonTrash from '../Buttons/ButtonTrash';

export default function ManhuaCard({data, onTrashManga}){

    //env vars
    // VITE_TARGET_HOST=http://localhost  //I USED 'VITE' TO CREATE THE SETUP FOR THIS PROJECT! 'VITE_' is mandatory.
    // VITE_TARGET_PORT=3001

    const targetHOST = import.meta.env.VITE_TARGET_HOST;  //I USED 'VITE' TO CREATE THE SETUP FOR THIS PROJECT!
    const targetPORT = import.meta.env.VITE_TARGET_PORT;
    const baseURL = `${targetHOST}:${targetPORT}`;

    return(
        <div id='manhuas' className='col'>
            <div className="bg-white rounded px-3 pt-3 d-flex justify-content-center position-relative custom-card">
                <div className="d-flex flex-column gap-2 card-content">
                    <div className="inner-image bg-blue2 d-flex justify-content-center align-items-center">
                        <img src={`${baseURL}/${data.file}`} alt='' className="img-fluid"/>  {/*better env vars x link localhost*/}
                    </div>
                    <h1 className="title">{data.title}</h1>
                    <p>{data.content}</p>
                    <ButtonTrash mangaId={data.id} onTrashManga={onTrashManga}/>
                </div>
                <img
                    src='../../public/imgs/pin.svg'
                    className="pin-card position-absolute top-0"
                    alt="pin card"
                />   
            </div>
        </div>
    );
} 