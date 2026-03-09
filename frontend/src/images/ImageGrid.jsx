import { Link } from "react-router";
import "./Images.css";

export function ImageGrid(props) {
    const imageElements = props.images.map((image) => (
        <div key={image._id} className="ImageGrid-photo-container">
            <Link to={"/images/" + image._id}>
                <img src={image.src} alt={image.name}/>
            </Link>
        </div>
    ));
    return (
        <div className="ImageGrid">
            {imageElements}
        </div>
    );
}
