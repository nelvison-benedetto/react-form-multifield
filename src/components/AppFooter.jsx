export default function AppFooter(){
    return(
       <footer>
         <div className="container py-1" id="debug" >
          <span>&#169; {new Date().getFullYear()} - All Rights Reserved</span>
         </div>
       </footer> 
    );
}