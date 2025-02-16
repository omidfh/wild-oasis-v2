"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import DeleteReservation from "../_components/DeleteReservation";
import { deleteBooking, getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in first!");

  const nationalID = formData.get("nationalID");

  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid National ID");

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    console.log(error);
    throw new Error("Guest could not be updated");
  }
  revalidatePath("/account/profile");

  return data;
}

export async function deleteReservationAction(id) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in first!");

  const guestBookings = await getBookings(session.user.guestId);
  const bookingIds = guestBookings.map((booking) => booking.id);

  if (!bookingIds.includes(id))
    throw new Error("You are not allowed to delete this booking");

  ///delete functionality
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

//*create reservation function

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in first!");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  console.log(newBooking);

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    console.log(error);
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

///* update reservation action

export async function updateReservation(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in first!");

  const guestBookings = await getBookings(session.user.guestId);
  const bookingIds = guestBookings.map((booking) => booking.id);

  const reservationId = Number(formData.get("id"));

  const numGuests = formData.get("numGuests");
  // const observations
  const observations = formData.get("observations");

  const updatedFields = { numGuests, observations };

  if (!bookingIds.includes(reservationId))
    throw new Error("You are not allowed to update this booking");

  console.log("booking ids : ", bookingIds);
  console.log("form data is here", formData);

  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", reservationId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  revalidatePath(`/account/reservations/edit/${reservationId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}

//*others

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
