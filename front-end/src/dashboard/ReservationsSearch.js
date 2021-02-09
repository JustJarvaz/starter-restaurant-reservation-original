function ReservationsSearch({
  searchValue,
  setSearchValue,
  loadSearchResults,
}) {
  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    loadSearchResults();
  }

  function changeHandler({ target: { value } }) {
    setSearchValue(value);
  }

  return (
    <form onSubmit={submitHandler}>
      <fieldset>
        <div className="row">
          <div className="form-group col">
            <label htmlFor="reservations_search">Search:</label>
            <input
              type="text"
              id="reservations_search"
              name="reservations_search"
              className="form-control"
              value={searchValue}
              placeholder="Enter a customer's phone number"
              onChange={changeHandler}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          <span className="oi oi-check" /> Find
        </button>
      </fieldset>
    </form>
  );
}

export default ReservationsSearch;
