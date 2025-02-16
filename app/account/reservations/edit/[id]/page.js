import { updateReservation } from "@/app/_lib/actions";
import { getBooking, getCabin } from "@/app/_lib/data-service";
import { Button } from "./Button";

export default async function Page({ params }) {
  const booking = await getBooking(params.id);

  const cabin = await getCabin(booking?.cabinId);

  console.log("this is booking", booking);
  console.log("this is cabin", cabin);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{booking.id}
      </h2>

      <form
        action={updateReservation}
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      >
        <input type="hidden" name="id" value={booking.id} />
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
            defaultValue={booking.numGuests}
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: cabin?.maxCapacity }, (_, i) => i + 1).map(
              (x) => (
                <option value={x} key={x}>
                  {x} {x === 1 ? "guest" : "guests"}
                </option>
              )
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            // value={booking.observations}
            defaultValue={booking.observations}
            name="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>
        <Button>Update reservation</Button>
        <div className="flex justify-end items-center gap-6"></div>
      </form>
    </div>
  );
}
