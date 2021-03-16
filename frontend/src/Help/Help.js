import React from 'react';
import {Link} from "react-router-dom";

const Help = () => {
  return (
    <div className="container-fluid">
      <div className="container">
        <div>
          <h1>Help</h1>
          <p>
            Vigilio is using <a href="https://www.npmjs.com/package/mud-parser" target="_blank">mud-parser</a>
            &nbsp;to get search results and show the acquired results.
            This website is a front-end to add sources easier.
            A source has to have at least an imdbId and a source.
            The source can be either a magnet or .torrent file url.
          </p>
          <h2>Fields</h2>
          <p>A valid imdb ID and a source is mandatory. Although the rest of the fields are optional, it is
            better to include them as they will give more information about the results.</p>
          <p className="my-1"><b>imdbId</b></p>
          <p className="my-1"><b>source</b></p>
          <p className="my-1">title</p>
          <p className="my-1">image</p>
          <p className="my-1">quality</p>
          <p className="my-1">seeds</p>
          <p className="my-1">size</p>
          <p>type</p>
          <p>An example schema and the results can be found <Link to="/example">here.</Link></p>
          <h2>mud-parser syntax</h2>
          <p>Even though mud-parser is more flexible, this site statically prepares the keys.
            You only need to adjust the values.</p>
          <p>Property values are spearated by dots. <code>movieDetails.movieTitle</code></p>
          <p>Arrays are designated by zeros. Array values can be in the beginning, middle
            or the end of a value. <code>movideDetails.cast.0.fullName</code> or <code>0.title</code></p>
          <p>Renaming an intermediary properties can be done with pipe symbols.
            &nbsp;<code>movieDetails.cast|castMembers.0.fullName</code> would be renaming cast to castName. This is useful
            because Vigilio is expecting sources array for the list of sources.</p>
          <div className="mb-5"></div>
        </div>
      </div>
    </div>
  );
}

export default Help;
