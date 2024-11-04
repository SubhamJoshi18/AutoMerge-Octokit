import os
from dotenv import load_dotenv,find_dotenv
load_dotenv(find_dotenv())

env_config = {
    "port":os.getenv('PORT')
}

