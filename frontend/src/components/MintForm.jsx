export const MintForm = ({formData,setWantToMint,handleChange,handleSubmit,formErrors}) => {
    
    return (
        <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl bg-[#1e1e2f] p-6 rounded-xl mt-6"
          >
            {/* Left column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label htmlFor="name" className="w-32 font-medium">
                  NFT Title
                </label>
                <select
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="flex-1 p-2 rounded bg-gray-700"
                >
                  <option value="Cyber Ape">Cyber Ape</option>
                  <option value="Pixel Bot">Pixel Bot</option>
                  <option value="Neo Samurai">Neo Samurai</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="desc" className="font-medium">
                  Description
                </label>
                <textarea
                  name="desc"
                  id="desc"
                  autoComplete="off"
                  placeholder="A short description of the NFT..."
                  value={formData.desc}
                  onChange={handleChange}
                  className="p-2 rounded bg-gray-700 min-h-[100px]"
                />
                {formErrors.desc && <p className="text-red-500 text-sm">{formErrors.desc}</p>}
              </div>

              <div className="flex items-center gap-4">
                <label htmlFor="background_col" className="w-32 font-medium">
                  Background
                </label>
                <select
                  id="background_col"
                  name="background_col"
                  value={formData.background_col}
                  onChange={handleChange}
                  className="flex-1 p-2 rounded bg-gray-700"
                >
                  <option value="Galaxy">Galaxy</option>
                  <option value="Sunset">Sunset</option>
                  <option value="Matrix">Matrix</option>
                  <option value="White">White</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label htmlFor="body" className="w-32 font-medium">
                  Body
                </label>
                <select
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  className="flex-1 p-2 rounded bg-gray-700"
                >
                  <option value="Robot">Robot</option>
                  <option value="Alien">Alien</option>
                  <option value="Human">Human</option>
                  <option value="Zombie">Zombie</option>
                </select>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label htmlFor="eye" className="w-32 font-medium">
                  Eye Style
                </label>
                <select
                  id="eye"
                  name="eye"
                  value={formData.eye}
                  onChange={handleChange}
                  className="flex-1 p-2 rounded bg-gray-700"
                >
                  <option value="Laser">Laser</option>
                  <option value="Glowing">Glowing</option>
                  <option value="Blindfold">Blindfold</option>
                  <option value="Sleepy">Sleepy</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="file" className="font-medium">
                  Artwork File
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  onChange={handleChange}
                  className="text-sm file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 bg-gray-700"
                />
                {formErrors.file && <p className="text-red-500 text-sm">{formErrors.file}</p>}
              </div>

              <div className="flex gap-4 mt-4 self-end">
                <button
                                type="submit"
                                id="mint"
                  className="bg-[#A259FF] px-5 py-2 rounded-2xl font-semibold text-lg hover:bg-purple-500"
                >
                  Mint NFT
                </button>
                <button
                                type="button"
                                id ="cancel"
                  onClick={() => setWantToMint(false)}
                  className="bg-red-400 px-5 py-2 rounded-2xl font-semibold text-lg hover:bg-purple-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
    )
}