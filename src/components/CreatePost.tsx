import {
  Box,
  Card,
  Container,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  CardBody,
  Switch,
  Select,
  Flex,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { BsPlusLg, BsFillImageFill } from "react-icons/bs";
import { TiVideo } from "react-icons/ti";
import { MdBubbleChart } from "react-icons/md";
import { useDisclosure } from "@chakra-ui/react-use-disclosure";
import { useState } from "react";
import { EventInfo } from "ckeditor5/src/utils";

function CreatePost() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openEmbed, setOpenEmbed] = useState(false);
  const [linkType, setLinkType] = useState(1);
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [uploadAlert, setUploadAlert] = useState(false);
  const [vidUrl, setVidUrl] = useState("");
  const [socialUrl, setSocialUrl] = useState("");

  const handleChange = (
    event: EventInfo<string, unknown>,
    editor: ClassicEditor
  ) => {
    var newContent = editor.getData();
    console.log(event);
    setContent(newContent);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);
    setUploadAlert(true);
    await axios
      .post(`https://caroapp-2sc7.onrender.com/api/product/upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        console.log(result);
        setUrl(result.data);
      })
      .catch((error) => {
        console.log("Errors", error);
      });
    setUploadAlert(false);
  };

  const handleImageEmbed = () => {
    const newImg = `<img src=${url}></img>`;
    if (url !== "") setContent((prev) => prev + newImg);
    onClose();
    setOpenEmbed(false);
  };

  const handleVideoEmbed = () => {
    const newVid = `<figure class="media"><oembed url=${vidUrl}></oembed></figure>`;
    if (vidUrl !== "") setContent((prev) => prev + newVid);
    onClose();
    setOpenEmbed(false);
  };

  const handleSocialEmbed = () => {
    const newVid = socialUrl;
    console.log(socialUrl);
    if (socialUrl !== "") setContent((prev) => prev + newVid);
    onClose();
    setOpenEmbed(false);
  };

  //const myImage = cld.image(url.name);
  return (
    <>
      <Container maxW={"container.md"} mt={20}>
        <Card h={"auto"}>
          <Box border="1px" h={8} borderColor="gray.200" bg={"#FAFAFA"}></Box>
          <Box
            paddingX={"7"}
            marginBottom={"-9"}
            h={"container.sm"}
            bg={"#FAFAFA"}
          >
            <Input
              border={"none"}
              placeholder="Add post title"
              size={"lg"}
              fontWeight={"bold"}
            />
            <CKEditor
              editor={ClassicEditor}
              config={{
                removePlugins: ["Images", "Media"],
                cloudServices: {
                  tokenUrl:
                    "https://98501.cke-cs.com/token/dev/JsXY6y4NVJ5z88TtaLOoYKfufY4f79ToksZ9?limit=10",
                  uploadUrl: "https://98501.cke-cs.com/easyimage/upload/",
                },
              }}
              data={content}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={handleChange}
            />

            <BsPlusLg
              onClick={() => setOpenEmbed((prev) => !prev)}
              style={{
                cursor: "pointer",
                backgroundColor: "#E7F1E9",
                marginTop: "5px",
                borderRadius: "50px",
                fontSize: "1.5em",
              }}
            />
            {openEmbed && (
              <Card w={{ base: "64", md: "sm" }} mt={2}>
                <CardBody paddingX={0}>
                  <Text paddingX={"5"}>EMBEDS</Text>
                  <Flex mt={3} direction={"column"} gap={4}>
                    <Flex
                      gap={"4"}
                      padding={"5"}
                      onClick={onOpen}
                      onMouseOver={() => setLinkType(1)}
                      bg={linkType === 1 ? "#F7FCF8" : ""}
                    >
                      <BsFillImageFill
                        style={{
                          marginTop: "7px",
                        }}
                      />
                      <Flex direction={"column"} justify={"space-between"}>
                        <Text fontWeight={"medium"}>Picture</Text>
                        <Text fontSize={"smaller"}>Jpeg, png</Text>
                      </Flex>
                    </Flex>
                    <Flex
                      gap={"4"}
                      paddingX={"5"}
                      paddingY={"2"}
                      onClick={onOpen}
                      onMouseEnter={() => setLinkType(2)}
                      bg={linkType === 2 ? "#F7FCF8" : ""}
                    >
                      <TiVideo
                        style={{
                          marginTop: "7px",
                        }}
                      />
                      <Flex direction={"column"} justify={"space-between"}>
                        <Text fontWeight={"medium"}>Video</Text>
                        <Text fontSize={"smaller"}>
                          JW player, Youtube, Vimeo
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex
                      gap={"4"}
                      paddingX={"5"}
                      paddingY={"2"}
                      onClick={onOpen}
                      onMouseOver={() => setLinkType(3)}
                      bg={linkType === 3 ? "#F7FCF8" : ""}
                    >
                      <MdBubbleChart
                        style={{
                          marginTop: "7px",
                        }}
                      />
                      <Flex direction={"column"} justify={"space-between"}>
                        <Text fontWeight={"medium"}>Social</Text>
                        <Text fontSize={"smaller"}>
                          Instagram, Twitter, TikTok, Snapchat, Facebook
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </CardBody>
              </Card>
            )}
          </Box>
          <Box
            border="1px"
            h={8}
            borderColor="gray.200"
            bg={"#FFFFFF"}
            paddingX={"5"}
            fontSize={"sm"}
            textAlign={"right"}
            paddingTop={"1"}
            mt={10}
          >
            0/1000 words
          </Box>
        </Card>
        <Modal
          size={{ base: "xs", md: "lg" }}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize={"md"} fontWeight={"bold"}>
              Embed
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {linkType === 1 && (
                <>
                  <Text fontSize={"sm"}>Upload Image</Text>
                  <Text fontSize={"x-small"} mt={{ base: "1.5", md: "3" }}>
                    FILE UPLOAD
                  </Text>
                  <Box
                    h={"40"}
                    border={"1px"}
                    mt={{ base: "1.5", md: "3" }}
                    borderColor={"#0A7227"}
                    paddingX={{ base: "10", md: "24" }}
                    borderRadius={"md"}
                    borderStyle={"dashed"}
                  >
                    <FormLabel
                      htmlFor="file-input"
                      border={"1px"}
                      mt={{ base: "14", md: "16" }}
                      textAlign={"center"}
                      borderColor={"#0A7227"}
                      borderRadius={"md"}
                      fontSize={{ base: "sm", md: "smaller" }}
                      paddingY={"1"}
                      fontWeight={"light"}
                    >
                      Import Image from Device
                    </FormLabel>
                    <Input
                      id="file-input"
                      onChange={handleUpload}
                      display={"none"}
                      type="file"
                    />
                  </Box>
                  <Flex gap={2} mt={3}>
                    <Button
                      bg={"#0A7227"}
                      color={"white"}
                      paddingY={"-1.5"}
                      fontSize={"sm"}
                      fontWeight={"medium"}
                      onClick={handleImageEmbed}
                      disabled={uploadAlert}
                    >
                      {uploadAlert ? "Uploading" : "Embed"}
                    </Button>
                    <Button
                      border={"1px"}
                      borderRadius={"md"}
                      borderColor={"gray"}
                      fontSize={"sm"}
                      fontWeight={"medium"}
                      color={"gray.700"}
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </>
              )}
              {linkType === 2 && (
                <>
                  <Text fontSize={"x-small"} my={"3"}>
                    VIDEO PROVIDER
                  </Text>

                  <Select placeholder="Select option">
                    <option value="youtube">Youtube</option>
                    <option value="jw">JW Player</option>
                    <option value="vimeo">Vimeo</option>
                  </Select>
                  <FormLabel htmlFor="url-input" fontSize={"x-small"} mt={"5"}>
                    URL
                  </FormLabel>
                  <Input
                    id="url-input"
                    onChange={(e) => setVidUrl(e.target.value)}
                    type="text"
                  />
                  <Flex gap={2} mt={3}>
                    <Button
                      bg={"#0A7227"}
                      color={"white"}
                      paddingY={"-1.5"}
                      fontSize={"sm"}
                      fontWeight={"medium"}
                      onClick={handleVideoEmbed}
                    >
                      Embed
                    </Button>
                    <Button
                      border={"1px"}
                      borderRadius={"md"}
                      borderColor={"gray"}
                      fontSize={"sm"}
                      fontWeight={"medium"}
                      color={"gray.700"}
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </>
              )}
              {linkType === 3 && (
                <>
                  <Text fontSize={"x-small"} my={"3"}>
                    SOCIAL MEDIA PLATFORM
                  </Text>

                  <Select placeholder="Select option">
                    <option value="insta">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="tiktok">TikTok</option>
                    <option value="snap">Snapchat</option>
                  </Select>
                  <FormLabel htmlFor="url-input" fontSize={"x-small"} mt={"3"}>
                    URL
                  </FormLabel>
                  <Input id="url-input" type="text" />
                  <FormLabel htmlFor="code-input" fontSize={"x-small"} mt={"3"}>
                    CODE
                  </FormLabel>
                  <Input
                    id="code-input"
                    onChange={(e) => setSocialUrl(e.target.value)}
                    type="text"
                  />
                  <Flex mt={3} justify={"space-between"}>
                    <Text>Disable Caption</Text>
                    <Switch id="email-alerts" colorScheme="whatsapp" />
                  </Flex>
                  <Flex gap={2} mt={3}>
                    <Button
                      bg={"#0A7227"}
                      color={"white"}
                      paddingY={"-1.5"}
                      fontSize={"sm"}
                      fontWeight={"medium"}
                      onClick={handleSocialEmbed}
                    >
                      Embed
                    </Button>
                    <Button
                      border={"1px"}
                      borderRadius={"md"}
                      borderColor={"gray"}
                      fontSize={"sm"}
                      fontWeight={"medium"}
                      color={"gray.700"}
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
}

export default CreatePost;
