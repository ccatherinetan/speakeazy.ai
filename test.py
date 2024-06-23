import asyncio
import certifi
import ssl
from hume import HumeStreamClient
from hume.models.config import FaceConfig

async def main():
    config = FaceConfig(identify_faces=True)
    client = HumeStreamClient("kSRetP2vbvj04rlbtkB8fFmtfRGMAbNnBTlqlDDZ0Fb9UCya")

    ssl_context = ssl.create_default_context(cafile=certifi.where())

    async with client.connect([config], ssl=ssl_context) as socket:
        async for response in socket:
            print(response)

if __name__ == "__main__":
    asyncio.run(main())
